import {COLORS} from 'Components/go/constants/GoGameConsts'
import {TDifficulty, TGameMode} from 'JS/types/gameTypes'
import { ReactNode } from 'react'

export type TPlayerColor = typeof COLORS[keyof typeof COLORS]
export type TBoard = (TPlayerColor | null)[][]

export type TMoveLocation = {
    row: number
    column: number
}

export type TGameState = {
    squares: TBoard
    previousMoves: {
        locations: TMoveLocation[];
        moves: TBoard[];
    }
    currentMove: number
    maxMoves: number
    nextColor: TPlayerColor
    previousColor: TPlayerColor
    // @TODO: Is colors needed with the addition of nextColor and previousColor?
    // Vs. Computer, next and previous colors never change.
    colors: {
        user: TPlayerColor
        ai: TPlayerColor
    };
    scores: {
        [value in TPlayerColor]: number
    };
    versus: TGameMode
    level: TDifficulty
    winner: TPlayerColor | null
}

export type TGoGameContextProps = {
    state: TGameState
    dispatch: React.Dispatch<TReducerAction>
}

export type TGoGameContextProviderProps = {
    children: ReactNode
}

export type TScores = {
    [value in TPlayerColor]: number
}

// Actions
export type TSetSquareAction = {
    type: 'SET_SQUARE'
    row: number
    column: number
}
export type TBasicAction = {
    type: 'UNDO_MOVE' | 'RESET_BOARD'
}
export type TSetVersusAction = {
    type: 'SET_VERSUS'
    versus: TGameMode
}
export type TSetLevelAction = {
    type: 'SET_LEVEL'
    level: TDifficulty
}

export type TReducerAction =
    | TSetSquareAction
    | TBasicAction
    | TSetVersusAction
    | TSetLevelAction