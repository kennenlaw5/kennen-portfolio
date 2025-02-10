import {TBoard, TDifficulty, TPlayerLetter} from 'Components/TicTacToe/types/TicTacToeTypes'
import {BOARD_POSITIONS, DIFFICULTIES, WINNING_COMBOS} from 'Components/TicTacToe/constants/TicTacToeConstants'

export const getIsWinningMove = (board: TBoard, moveIndex: number) => {
    return Object.values(WINNING_COMBOS)
        .flat()
        .filter((combo) => combo.includes(moveIndex))
        .some(combo => combo.every(index => board[index] === board[combo[0]]))
}

const getPlayableCombinations = (board: TBoard) => {
    return Object.values(WINNING_COMBOS)
        .flat()
        .filter(combo => combo.some(index => !board[index]))
}

const getPlayableCombinationsByIndex = (board: TBoard, index: number) => {
    return Object.values(WINNING_COMBOS)
        .flat()
        .filter(combo => combo.includes(index) && combo.some(index => !board[index]))
}

const getComputerMoveCount = (board: TBoard, computerLetter: TPlayerLetter) => board.reduce(
    (prevValue, cell) => prevValue + (cell === computerLetter ? 1 : 0),
    0
)
const getMoveCount = (board: TBoard) => board.reduce(
    (prevValue, cell) => prevValue + (cell ? 1 : 0),
    0
)

const getRandomMove = (board: TBoard): number => {
    const boardLength = board.length
    let moveIndex = Math.floor(Math.random() * boardLength)

    // If random move is already taken, try again
    while (board[moveIndex]) {
        moveIndex = Math.floor(Math.random() * boardLength)
    }

    return moveIndex
}

const getWinningMove = (board: TBoard, computerLetter: TPlayerLetter): number | null => {
    return getPlayableCombinations(board).find(combo => {
        // Check if computer has two moves in a combo and there is an empty cell
        const computerCount = combo.filter(index => board[index] === computerLetter).length
        const hasEmptyCell = combo.some(index => !board[index])

        return computerCount === 2 && hasEmptyCell
    })?.find(index => !board[index]) ?? null
}

const getLosingMove = (board: TBoard, computerLetter: TPlayerLetter): number | null => {
    return getPlayableCombinations(board).find(combo => {
        // Check if player has two moves in a combo and there is an empty cell
        const playerCount = combo.filter(index => board[index] && board[index] !== computerLetter).length
        const hasEmptyCell = combo.some(index => !board[index])
        
        return playerCount === 2 && hasEmptyCell
    })?.find(index => !board[index]) ?? null
}


const getNormalMove = (board: TBoard, computerLetter: TPlayerLetter): number => {
    if (getMoveCount(board) <= 1) { 
        return getRandomMove(board)
    }

    // Check if computer can win (runs on normal difficulty)
    const winningMove = getWinningMove(board, computerLetter)

    // If computer can win, make that move
    if (typeof winningMove === 'number') {
        return winningMove
    }

    // Check if player can win (runs on normal difficulty)
    const losingMove = getLosingMove(board, computerLetter)

    // If player can win, block them
    if (typeof losingMove === 'number') {
        return losingMove
    }

    // Fallback to random move
    return getRandomMove(board)
}

const getAvailableCorner = (board: TBoard): number => {
    const {
        BOTTOM_LEFT,
        BOTTOM_RIGHT,
        TOP_LEFT,
        TOP_RIGHT,
    } = BOARD_POSITIONS
    const availableMoves = [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT]
        .filter(index => !board[index])

    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
}

const getGenericStrategyMove = (board: TBoard, computerLetter: TPlayerLetter, allowedIndexes?: number[]): number | null => {
    const winningMovesMap = board.map((cell, index) => {
        const shouldSkip = allowedIndexes && !allowedIndexes.includes(index)

        if (cell || shouldSkip) {
            return 0
        }

        const testBoard = [...board]
        testBoard[index] = computerLetter
        // Check how many winning moves the computer has on the next turn if this move is made
        const winningCombos = getPlayableCombinationsByIndex(testBoard, index)
        .filter(combo => (
            combo.filter(index => testBoard[index] === computerLetter).length === 2
        ))

        return winningCombos.length
    })

    if (winningMovesMap.includes(2)) {
        return winningMovesMap.indexOf(2)
    }

    return winningMovesMap.includes(1) ? winningMovesMap.indexOf(1) : null
}

const getCornerStrategyMove = (board: TBoard, computerLetter: TPlayerLetter): number | null => {
    const {
        BOTTOM_LEFT,
        BOTTOM_RIGHT,
        MIDDLE_CENTER,
        TOP_LEFT,
        TOP_RIGHT,
    } = BOARD_POSITIONS
    const corners = [TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT]
    const computerMoveCount = getComputerMoveCount(board, computerLetter)

    if (computerMoveCount !== 1) {
        return getGenericStrategyMove(board, computerLetter)
    }
    
    // For second move, determine which corner to play
    const isCenterTaken = board[MIDDLE_CENTER]
    const takenCornerIndex = corners.findIndex(index => board[index] === computerLetter)
    const oppositeCorner = [...corners].reverse()[takenCornerIndex]
    
    if (isCenterTaken && !board[oppositeCorner]) {
        return oppositeCorner
    }
    
    const oppositeCornerIndex = corners.findIndex(corner => corner === oppositeCorner)
    const availableCorners = corners.filter(
        (corner, index) => !board[corner] && oppositeCornerIndex !== index
    )

    return getGenericStrategyMove(board, computerLetter, availableCorners) ?? availableCorners[0]
}

const getHardMove = (board: TBoard, computerLetter: TPlayerLetter): number => {
    const computerMoves = getComputerMoveCount(board, computerLetter)

    if (!computerMoves) {
        return getAvailableCorner(board)
    }

    const finalMove = getWinningMove(board, computerLetter) ?? getLosingMove(board, computerLetter)

    if (finalMove !== null) {
        return finalMove
    }

    return getCornerStrategyMove(board, computerLetter) ?? getRandomMove(board)
}

export const getComputerMove = (board: TBoard, difficulty: TDifficulty, computerLetter: TPlayerLetter): number => {
    switch (difficulty) {
        case DIFFICULTIES.HARD:
            return getHardMove(board, computerLetter)
        case DIFFICULTIES.NORMAL:
            return getNormalMove(board, computerLetter)
        default:
            return getRandomMove(board)
    }
}
