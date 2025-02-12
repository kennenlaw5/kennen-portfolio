import {TBoard, TGameState, TScores, TSetSquareAction} from 'Components/go/types/GoGameTypes'
import {BOARD_DIMENSIONS, COLORS} from 'Components/go/constants/GoGameConsts'
import {initialState} from 'Components/go/context/GoGameContext'
import { GAME_MODES } from 'JS/constants/gameConsts'

const scoreCount = (board: TBoard): TScores => {
    const cells = board.flat()
    const scores: TScores = {
        [COLORS.RED]: 0,
        [COLORS.BLUE]: 0
    }

    cells.forEach(cell => {
        if (!cell) {
            return
        }

        scores[cell] += 1
    })

    return scores
}

const getIsCapturedCell = (squares: TBoard, rowIndex: number, columnIndex: number, color: string): boolean => {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

    return directions.every(([dx, dy]) => {
        const newRow = rowIndex + dx
        const newColumn = columnIndex + dy

        // If new cell is out of bounds return true
        if (newRow < 0 || newRow >= BOARD_DIMENSIONS.ROWS || newColumn < 0 || newColumn >= BOARD_DIMENSIONS.COLS) {
            return true
        }

        return squares[newRow][newColumn] === color
    })
}

const handleCapturesByColor = (squares: TBoard, color: string): TBoard => {
    return squares.map((row, rowBaseIndex) => (
        row.map((cell, colBaseIndex) => {
            if (cell === color || !cell) {
                return cell
            }
            const isCaptured = getIsCapturedCell(squares, rowBaseIndex, colBaseIndex, color)

            return isCaptured ? color : cell
        })
    ))
}

const handleCaptures = (squares: TBoard, state: TGameState) => {
    const {
        nextColor: playerColor,
        previousColor: opponentColor
    } = state
    const newSquares = handleCapturesByColor(squares, playerColor)

    return handleCapturesByColor(newSquares, opponentColor)
}

const handleMove = (state: TGameState, rowIndex: number, columnIndex: number) => {
    const newSquares = structuredClone(state.squares)
    newSquares[rowIndex][columnIndex] = state.nextColor

    return handleCaptures(newSquares, state)
}

const getWinner = (scores: TScores): string | null => {
    if (scores[COLORS.RED] === scores[COLORS.BLUE]) {
        return null
    }

    return scores[COLORS.RED] > scores[COLORS.BLUE] ? COLORS.RED : COLORS.BLUE
}

export const setSquare = (state: TGameState, action: TSetSquareAction): TGameState => {
    const newSquares = handleMove(state, action.row, action.column)
    const location = {
        row: action.row + 1,
        column: action.column + 1
    }
    const newPreviousMoves = {
        locations: [...state.previousMoves.locations, location],
        moves: [...state.previousMoves.moves, newSquares],
    }

    const scores = scoreCount(newSquares)
    const currentMove = state.currentMove + 1
    const winner = currentMove === state.maxMoves ? getWinner(scores) : null

    return {
        ...state,
        squares: newSquares,
        previousMoves: newPreviousMoves,
        currentMove,
        nextColor: state.previousColor,
        previousColor: state.nextColor,
        scores,
        winner,
    }
}

export const undoMove = (state: TGameState): TGameState => {
    const currentMove = state.currentMove - 1

    if (currentMove < 0) {
        return state
    }

    const previousMoves = {
        locations: state.previousMoves.locations.slice(0, currentMove),
        moves: state.previousMoves.moves.slice(0, currentMove),
    }

    const newSquares =  previousMoves.moves[currentMove - 1] || initialState.squares
    const newState = {
        ...state,
        squares: newSquares,
        previousMoves,
        currentMove,
        winner: null,
        scores: scoreCount(newSquares),
    }

    if (state.versus !== GAME_MODES.COMPUTER) {
        newState.nextColor = state.previousColor
        newState.previousColor = state.nextColor
    }

    return newState
}
    