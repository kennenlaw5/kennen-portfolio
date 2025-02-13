import {COLORS} from 'Components/go/constants/GoGameConsts'
import {TDifficulty, TGameMode} from 'JS/types/gameTypes'
import { ReactNode } from 'react'

export type TPlayerColor = typeof COLORS[keyof typeof COLORS]

// The board is a 2D array of TPlayerColor and null values
// null values represent empty/unplayed spaces
export type TBoard = (TPlayerColor | null)[][]

export type TMoveLocation = {
    row: number
    column: number
}
export type TScores = Record<TPlayerColor, number>

export type TGameState = {
    squares: TBoard
    previousMoves: {
        locations: TMoveLocation[]
        moves: TBoard[]
    }
    currentMove: number
    maxMoves: number
    nextColor: TPlayerColor
    previousColor: TPlayerColor
    previousMoveOffset: number
    isPlayerTurn: boolean
    scores: TScores
    versus: TGameMode
    difficulty: TDifficulty
    winner: TPlayerColor | null
}

export type TGoGameContextProps = {
    state: TGameState
    dispatch: React.Dispatch<TReducerAction>
}

export type TGoGameContextProviderProps = {
    children: ReactNode
}

// Move data types
export type TMoveDataScoreKeys = TPlayerColor | 'emptySpaces' | 'edgeSpaces'
export type TCellCounts = Record<TMoveDataScoreKeys, number>

// Move data is used to store calculated information about a move
// this information reduces the amount of calculations/iterations needed to determine the best move
export type TMoveData = {
    cellCounts: TCellCounts
    rowIndex: number
    columnIndex: number
    cellValue: TPlayerColor | null
}

// Actions
export type TSetSquareAction = {
    type: 'SET_SQUARE'
    row: number
    column: number
}
export type TBasicAction = {
    type: 'UNDO_MOVE' | 'RESET_BOARD' | 'SET_COMPUTER_SQUARE'
}
export type TSetVersusAction = {
    type: 'SET_VERSUS'
    versus: TGameMode
}
export type TSetLevelAction = {
    type: 'SET_LEVEL'
    difficulty: TDifficulty
}

export type TReducerAction =
    | TSetSquareAction
    | TBasicAction
    | TSetVersusAction
    | TSetLevelAction

// Ai Helper Types
export type TAdjacentCellData = {
    adjacentRow: number
    adjacentColumn: number
}
export type TBoardMoveData = TMoveData[][]

export type TGetAdjacentCells = (rowIndex: number, columnIndex: number) => TAdjacentCellData[]

/**
 * Returns the move data for a safe move adjacent to the current cell being evaluated
 * 
 * @param state - The current game state
 * @param moveData - The move data for the cell being evaluated
 * @param boardMoveData - The board move data
 */
export type TGetSafeAdjacentMove = (
    state: TGameState,
    moveData: TMoveData,
    boardMoveData: TBoardMoveData
) => TMoveData | null

/**
 * Returns the move data for a given row and column index
 * 
 * @param state - The current game state
 * @param rowIndex - The row index of the move
 * @param columnIndex - The column index of the move
 */
export type TGetMoveData = (state: TGameState, rowIndex: number, columnIndex: number) => TMoveData

/**
 * Returns a boolean indicating if a move is safe to make
 * @param state - The current game state
 * @param moveData - The move data for the proposed move
 * @param isTakeover - A boolean indicating if the move will takeover a player square
 */
export type TGetIsSafeMove = (state: TGameState, moveData: TMoveData, isTakeover?: boolean) => boolean

/**
 * Returns move data for a random move from a list of available moves
 * 
 * @param availableMoves - A list of available moves
 */
export type TGetRandomMove = (availableMoves: TMoveData[]) => TMoveData

/**
 * Returns move data for a random move from a list of safe available moves
 * if no safe moves are available, an unsafe random move is returned
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetSafeRandomMove = (state: TGameState, boardMoveData: TBoardMoveData) => ReturnType<TGetRandomMove>

/**
 * Returns move data for the best random move from a list of available moves
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetStrategicRandomMove = (state: TGameState, boardMoveData: TBoardMoveData) => ReturnType<TGetRandomMove>

/**
 * Returns an array of move data for all available moves where a takeover is possible
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetAvailableTakeovers = (state: TGameState, boardMoveData: TBoardMoveData) => TMoveData[]

/**
 * Returns an array of move data for all available moves where a trap is possible
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetAvailableTraps = (state: TGameState, boardMoveData: TBoardMoveData) => TMoveData[]

/**
 * Returns move data for a move on easy difficulty
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetEasyMove = (state: TGameState, boardMoveData: TBoardMoveData) => TMoveData | null

/**
 * Returns move data for a cell adjacent to the current cell to facilitate a takeover
 * 
 * @param state - The current game state
 * @param availableMoves - A list of available moves
 * @param boardMoveData - The board move data
 */
export type THandleTakeover = (
    state: TGameState,
    availableMoves: TMoveData[],
    boardMoveData: TBoardMoveData
) => ReturnType<TGetSafeAdjacentMove>

/**
 * Returns move data for a cell adjacent to the current cell to facilitate a trap
 * 
 * @param state - The current game state
 * @param availableMoves - A list of available moves
 * @param boardMoveData - The board move data
 */
export type THandleTrap = (
    state: TGameState,
    availableMoves: TMoveData[],
    boardMoveData: TBoardMoveData
) => ReturnType<TGetSafeAdjacentMove>

/**
 * Returns move data for a cell adjacent to the current cell to facilitate a strategic trap
 * meaning it will return a cell that is closer to completing a trap before one that is farther from completion
 * 
 * @param state - The current game state
 * @param availableMoves - A list of available moves
 * @param boardMoveData - The board move data
 */
export type THandleStrategicTrap = (
    state: TGameState,
    availableMoves: TMoveData[],
    boardMoveData: TBoardMoveData
) => ReturnType<THandleTrap>

/**
 * Returns move data for a move on normal difficulty
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetNormalMove = (state: TGameState, boardMoveData: TBoardMoveData) => TMoveData | null

/**
 * Returns move data for a move on hard difficulty
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetHardMove = (state: TGameState, boardMoveData: TBoardMoveData) => TMoveData | null

/**
 * Returns move data for the computer player's best move based on the current game difficulty
 * 
 * @param state - The current game state
 * @param boardMoveData - The board move data
 */
export type TGetComputerMove = (state: TGameState) => TMoveData | null

/**
 * Handles updating the game state when the computer player makes a move
 * 
 * @param state - The current game state
 */
export type TSetComputerSquare = (state: TGameState) => TGameState