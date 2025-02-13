import {getIsCellOutOfBounds, setSquare} from 'Components/go/helpers'
import {DIFFICULTIES} from 'Constants/gameConsts'
import {COLORS, MAX_ADJACENT_CELLS} from 'Components/go/constants/GoGameConsts'
import {
    TCellCounts,
    TGetAdjacentCells,
    TGetAvailableTakeovers,
    TGetAvailableTraps,
    TGetComputerMove,
    TGetEasyMove,
    TGetHardMove,
    TGetIsSafeMove,
    TGetMoveData,
    TGetNormalMove,
    TGetRandomMove,
    TGetSafeAdjacentMove,
    TGetSafeRandomMove,
    TGetStrategicRandomMove,
    THandleStrategicTrap,
    THandleTakeover,
    THandleTrap,
    TMoveData,
    TSetComputerSquare,
    TSetSquareAction
} from 'Components/go/types/GoGameTypes'

const getAdjacentCells: TGetAdjacentCells = (rowIndex, columnIndex) => {
    return [
        {adjacentRow: rowIndex - 1, adjacentColumn: columnIndex},
        {adjacentRow: rowIndex + 1, adjacentColumn: columnIndex},
        {adjacentRow: rowIndex, adjacentColumn: columnIndex - 1},
        {adjacentRow: rowIndex, adjacentColumn: columnIndex + 1},
    ]
}

const getSafeAdjacentMove: TGetSafeAdjacentMove = (state, moveData, boardMoveData) => {
    const {cellCounts, cellValue, rowIndex, columnIndex} = moveData
    const isTakeover = cellValue
        && !cellCounts[cellValue]
        && cellCounts.emptySpaces === 1

    const safeMoves = getAdjacentCells(rowIndex, columnIndex).filter(({adjacentRow, adjacentColumn}) => (
        !getIsCellOutOfBounds(adjacentRow, adjacentColumn)
        && getIsSafeMove(state, boardMoveData[adjacentRow][adjacentColumn], !!isTakeover)
    ))

    if (!safeMoves.length) {
        return null
    }

    const bestMove = safeMoves.find(({adjacentRow, adjacentColumn}) => {
        const {cellCounts} = boardMoveData[adjacentRow][adjacentColumn]

        return cellCounts[state.nextColor] + cellCounts.edgeSpaces < MAX_ADJACENT_CELLS
    }) || safeMoves[0]

    return boardMoveData[bestMove.adjacentRow][bestMove.adjacentColumn]
}

const getMoveData: TGetMoveData = (state, rowIndex, columnIndex) => {
    const adjacentCells = getAdjacentCells(rowIndex, columnIndex)
    const {
        squares,
        nextColor: computerColor,
        previousColor: playerColor,
    } = state
    const cellCounts: TCellCounts = {
        [playerColor]: 0,
        [computerColor]: 0,
        emptySpaces: 0,
        edgeSpaces: 0,
    }
    
    adjacentCells.forEach(({adjacentRow, adjacentColumn}) => {
        if (getIsCellOutOfBounds(adjacentRow, adjacentColumn)) {
            cellCounts.edgeSpaces += 1
            
            return
        }

        const color = squares[adjacentRow][adjacentColumn]
        
        if (color === null) {
            cellCounts.emptySpaces += 1

            return
        }

        cellCounts[color] += 1
    })

    return {
        rowIndex,
        columnIndex,
        cellCounts,
        cellValue: squares[rowIndex][columnIndex],
    }
}

const getIsSafeMove: TGetIsSafeMove = (state, moveData, isTakeover = false) => {
    const {
        nextColor: computerColor,
        previousColor: playerColor,
    } = state
    const {
        cellCounts,
        cellValue,
    } = moveData
    const {
        [playerColor]: playerCellCount,
        [computerColor]: computerCellCount,
        emptySpaces: emptyCellCount,
        edgeSpaces: edgeCellCount,
    } = cellCounts

    // If cell is already taken, it's not a safe move
    if (cellValue) {
        return false
    }

    // If computer has a cell adjacent to the move,
    // or the move will takeover a player cell it's a safe move
    if (computerCellCount > 0 || isTakeover) {
        return true
    }

    // Edge cells are "free cells" that can benefit either player
    // so they are added to the total count of player cells to check for traps
    const totalTrapCount = playerCellCount + edgeCellCount

    // If player has 3 adjacent cells, and there is only 1 empty cell
    // then the player will steal that cell on the next move, so it's not a safe move
    const canPlayerTrapCell = emptyCellCount === 1 && totalTrapCount === 3

    // If player has 4 adjacent cells and it's not a takeover,
    // then playing here would give this cell to the player
    const isPlayerTrap = totalTrapCount === MAX_ADJACENT_CELLS

    return !canPlayerTrapCell && !isPlayerTrap
}

const getRandomMove: TGetRandomMove = (availableMoves) => {
    // Makes game feel more human and less predictable
    const randomIndex = Math.floor(Math.random() * availableMoves.length)

    return availableMoves[randomIndex]
}

const getSafeRandomMove: TGetSafeRandomMove = (state, boardMoveData) => {
    const possibleMoves = boardMoveData.flat().filter(moveData => !moveData.cellValue)
    const safePossibleMoves = possibleMoves.filter(moveData => getIsSafeMove(state, moveData))

    return getRandomMove(safePossibleMoves.length ? safePossibleMoves : possibleMoves)
}

const getStrategicRandomMove: TGetStrategicRandomMove = (state, boardMoveData) => {
    const possibleMoves = boardMoveData.flat().filter(moveData => !moveData.cellValue)

    // Safe moves avoid player traps
    const safePossibleMoves = possibleMoves.filter(moveData => getIsSafeMove(state, moveData))
    // Strategic moves avoid player traps and avoid computer's own traps
    const strategicMoves = safePossibleMoves.filter(
        ({cellCounts}) => cellCounts[state.nextColor] + cellCounts.edgeSpaces < MAX_ADJACENT_CELLS
    )

    if (strategicMoves.length) {
        return getRandomMove(strategicMoves)
    }

    return getRandomMove(safePossibleMoves.length ? safePossibleMoves : possibleMoves)
}

const getAvailableTakeovers: TGetAvailableTakeovers = (state, boardMoveData) => {
    return boardMoveData.flat().filter(moveData => {
        const {cellValue, cellCounts} = moveData
        const {emptySpaces} = cellCounts

        if (!cellValue || !emptySpaces) {
            return false
        }

        const safeMove = getSafeAdjacentMove(state, moveData, boardMoveData)
        // If the safe move is a move inside computer's trap, and there are 2
        // or more empty spaces then player can't takeover the cell
        const {
            [cellValue]: cellValueCount,
            edgeSpaces,
        } = safeMove?.cellCounts || {}
        const isSafeMoveOwnTrap = cellValueCount + edgeSpaces === MAX_ADJACENT_CELLS
        const isCellSafe = emptySpaces > 1 && isSafeMoveOwnTrap

        return safeMove && !cellCounts[cellValue] && !isCellSafe
    })
}

const getAvailableTraps: TGetAvailableTraps = (state, boardMoveData) => {
    return boardMoveData.flat().filter(moveData => {
        const {cellValue, cellCounts} = moveData
        const {
            emptySpaces,
            [COLORS.BLUE]: blueCellsCount,
            [COLORS.RED]: redCellsCount
        } = cellCounts
        const hasSafeMove = emptySpaces && getSafeAdjacentMove(state, moveData, boardMoveData)

        return !cellValue && hasSafeMove && (!blueCellsCount || !redCellsCount)
    })
}

const getEasyMove: TGetEasyMove = (state, boardMoveData) => {
    const availableTakeovers = getAvailableTakeovers(state, boardMoveData)
        .filter(({cellCounts}) => cellCounts.emptySpaces <= 2)

    if (!availableTakeovers.length) {
        return null
    }

    const selectedMove = getRandomMove(availableTakeovers)

    return getSafeAdjacentMove(state, selectedMove, boardMoveData)
}

const handleTakeover: THandleTakeover = (state, availableMoves, boardMoveData) => {
    // If there is a move where computer can complete a takeover, do it first
    const offensiveMoves = availableMoves.filter(({cellValue}) => cellValue === state.previousColor)
    const moveSet = offensiveMoves.length ? offensiveMoves : availableMoves
    const selectedMove = getRandomMove(moveSet)

    return getSafeAdjacentMove(state, selectedMove, boardMoveData)
}

const handleTrap: THandleTrap = (state, availableMoves, boardMoveData) => {
    // If there is a move where computer can complete a trap, do it first
    const offensiveMoves = availableMoves.filter(({cellCounts}) => !cellCounts[state.previousColor])
    const moveSet = offensiveMoves.length ? offensiveMoves : availableMoves
    const selectedMove = getRandomMove(moveSet)

    return getSafeAdjacentMove(state, selectedMove, boardMoveData)
}

const handleStrategicTrap: THandleStrategicTrap = (state, availableMoves, boardMoveData) => {
    const strategicMoves = availableMoves.filter(({cellCounts}) => cellCounts.emptySpaces === 2)
    const moveSet = strategicMoves.length ? strategicMoves : availableMoves

    return handleTrap(state, moveSet, boardMoveData)
}


// Normal difficulty only checks for traps and takeovers that are 1 move away
// otherwise it will attempt to takeover a block that is 2 moves away
// (normal does not check for strategic traps more than 1 move away)
const getNormalMove: TGetNormalMove = (state, boardMoveData) => {
    const availableTakeovers = getAvailableTakeovers(state, boardMoveData)
    const urgentTakeovers = availableTakeovers.filter(({cellCounts}) => cellCounts.emptySpaces === 1)

    if (urgentTakeovers.length) {
        return handleTakeover(state, urgentTakeovers, boardMoveData)
    }

    const urgentTraps = getAvailableTraps(state, boardMoveData)
        .filter(({cellCounts}) => cellCounts.emptySpaces === 1)

    if (urgentTraps.length) {
        return handleTrap(state, urgentTraps, boardMoveData)
    }

    const passiveTakeovers = availableTakeovers.filter(({cellCounts}) => cellCounts.emptySpaces === 2)
    if (!passiveTakeovers.length) {
        return null
    }

    // Makes move seem more human
    const selectedMove = getRandomMove(passiveTakeovers)

    return getSafeAdjacentMove(state, selectedMove, boardMoveData)
}

const getHardMove: TGetHardMove = (state, boardMoveData) => {
    const availableTraps = getAvailableTraps(state, boardMoveData)

    // If there is a trap that can be completed in 2 or 3 moves, do it first
    // (note: normal difficulty already checked for traps that are only 1 move away)
    const strategicTraps = availableTraps.filter(({cellCounts}) => cellCounts.emptySpaces <= 3)

    if (strategicTraps.length) {
        return handleStrategicTrap(state, strategicTraps, boardMoveData)
    }

    const availableTakeovers = getAvailableTakeovers(state, boardMoveData)

    // If there is a takeover that can be completed in 3 move, do it first
    // (note: we do not check 2 or 1 move out here because normal difficulty already did that check)
    const strategicTakeovers = availableTakeovers
        .filter(({cellCounts}) => cellCounts.emptySpaces === 3)

    if (strategicTakeovers.length) {
        return handleTakeover(state, strategicTakeovers, boardMoveData)
    }

    // If there is a trap that can be started, do it
    if (availableTraps.length) {
        return handleTrap(state, availableTraps, boardMoveData)
    }

    // If there is a takeover that can be started, do it
    // otherwise make a strategic random move
    return availableTakeovers.length
        ? handleTakeover(state, availableTakeovers, boardMoveData)
        : getStrategicRandomMove(state, boardMoveData)
}

const getComputerMove: TGetComputerMove = (state) => {
    const {
        squares,
        difficulty,
    } = state

    const boardMoveData = squares.map((row, rowIndex) => (
        row.map((_, columnIndex) => getMoveData(state, rowIndex, columnIndex))
    ))

    const possibleMoves = boardMoveData.flat().filter(moveData => !moveData.cellValue)

    if (!possibleMoves.length) {
        return null
    }

    switch (difficulty) {
        case DIFFICULTIES.EASY:
            return getEasyMove(state, boardMoveData) ?? getSafeRandomMove(state, boardMoveData)
        case DIFFICULTIES.NORMAL:
            return getNormalMove(state, boardMoveData) ?? getSafeRandomMove(state, boardMoveData)
        case DIFFICULTIES.HARD:
            return getNormalMove(state, boardMoveData) ?? getHardMove(state, boardMoveData)
        default:
            return getSafeRandomMove(state, boardMoveData)
    }
}

export const setComputerSquare: TSetComputerSquare = (state) => {
    const computerMove = getComputerMove(state)
    
    if (!computerMove) {
        return state
    }

    const action: TSetSquareAction = {
        type: 'SET_SQUARE',
        row: computerMove.rowIndex,
        column: computerMove.columnIndex,
    }

    return setSquare(state, action)
}