import {TBoard, TDifficulty, TPlayerLetter} from 'Components/TicTacToe/types/TicTacToeTypes'
import {DIFFICULTIES, WINNING_COMBOS} from 'Components/TicTacToe/constants/TicTacToeConstants'

export const getIsWinningMove = (board: TBoard, moveIndex: number) => {
    return WINNING_COMBOS
        .filter((combo) => combo.includes(moveIndex))
        .some(combo => combo.every(index => board[index] === board[combo[0]]))
}

const getPlayableCombinations = (board: TBoard) => WINNING_COMBOS.filter(combo => combo.some(index => !board[index]))
const getComputerMoveCount = (board: TBoard, computerLetter: TPlayerLetter) => board.reduce(
    (prevValue, cell) => prevValue + (cell === computerLetter ? 1 : 0),
    0
)
const getMoveCount = (board: TBoard) => board.reduce(
    (prevValue, cell) => prevValue + (cell ? 1 : 0),
    0
)

const getRandomMove = (board: TBoard): number => {
    let moveIndex = Math.floor(Math.random() * 9)

    // If random move is already taken, try again
    while (board[moveIndex]) {
        moveIndex = Math.floor(Math.random() * 9)
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

    const availableCombinations = getPlayableCombinations(board)

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

const getHardFirstMove = (board: TBoard): number => {
    // Pick a random corner
    const corners = [0, 2, 6, 8]
    return corners[Math.floor(Math.random() * corners.length)]
}

const getCornerStrategyMove = (board: TBoard, computerLetter: TPlayerLetter): number | null => {
    const cornerIndexes = [0, 2, 6, 8]
    const availableCorners = cornerIndexes.filter(index => !board[index])
    const computerMoves = getComputerMoveCount(board, computerLetter)
    const isCenterAvailable = !board[4]
    // Computer's first move is always a corner. If availableCorners is 1, then a corner trap can be setup
    // Assuming the player has not taken the center
    if (computerMoves === 1 && availableCorners.length === 3 && isCenterAvailable) {
        const selectedCombination = getPlayableCombinations(board).find(combo => {
            // Check if computer has two moves in a combo and there is an empty cell
            const computerCount = combo.filter(index => board[index] === computerLetter).length
            const emptyCellCount = combo.filter(index => !board[index]).length
    
            return computerCount === 1 && emptyCellCount === 2
        })!

        return selectedCombination[0] ? selectedCombination[2] : selectedCombination[0]
    }

    // Check to verify the second move was a corner first
    const computerCorners = availableCorners.filter(index => board[index] === computerLetter)
    const isOnlyComputerandEmptyCorners = computerCorners.length === 2 && availableCorners.length === 2
    const winningMove = getWinningMove(board, computerLetter)

    if (isOnlyComputerandEmptyCorners) {
        // Corner trap has been setup, take the center or win if player missed the trap
        return winningMove ?? 4
    }

    return winningMove
}

const getHardMove = (board: TBoard, computerLetter: TPlayerLetter): number => {
    // If it's the first move, pick a random corner
    if (getMoveCount(board) <= 1) {
        const availableCorners = [0, 2, 6, 8].filter(index => !board[index])

        return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    const finalMove = getWinningMove(board, computerLetter) ?? getLosingMove(board, computerLetter)

    if (finalMove) {
        return finalMove
    }

    const cornerStrategyMove = getCornerStrategyMove(board, computerLetter)

    if (cornerStrategyMove) {
        return cornerStrategyMove
    }

    // @todo Find a move where the computer will get a winning move in two combinations on the next turn

    // Fallback: Make any available move (shouldn't happen, but good for safety)
    return getRandomMove(board)
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
