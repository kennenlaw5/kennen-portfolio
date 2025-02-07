import {ReactNode} from 'react'
import {DIFFICULTIES, GAME_MODES, PLAYER_LETTERS} from 'Components/TicTacToe/constants/TicTacToeConstants'

export type TBoard = string[]
export type TPlayerLetter = typeof PLAYER_LETTERS[keyof typeof PLAYER_LETTERS]
export type TGameMode = typeof GAME_MODES[keyof typeof GAME_MODES]
export type TDifficulty = typeof DIFFICULTIES[keyof typeof DIFFICULTIES]
export type TTicTacToeState = {
    gameMode: TGameMode
    difficulty: TDifficulty
    playerLetter: TPlayerLetter
    currentTurn: TPlayerLetter
    board: TBoard
    isGameActive: boolean
    winner: TPlayerLetter | null
    isBoardFull: boolean
}

// Tic Tac Toe context
export type Action =
  | TUpdateFieldAction
  | {type: 'SET_PLAYER_LETTER'; payload: TPlayerLetter}
  | {type: 'START_GAME'}
  | {type: 'RESET_GAME'}
  | {type: 'MAKE_COMPUTER_MOVE'}
  | TMakePlayerMoveAction

export type TTicTacToeProviderProps = {
  children: ReactNode
}

export type TTicTacToeContextProps = {
    state: TTicTacToeState
    dispatch: React.Dispatch<Action>
}

export type TUpdateFieldPayload = {
    field: keyof TTicTacToeState
    value: TTicTacToeState[keyof TTicTacToeState]
}

export type TUpdateFieldAction = {
    type: 'UPDATE_FIELD'
    payload: TUpdateFieldPayload
}

export type TMakePlayerMoveAction = {
    type: 'MAKE_PLAYER_MOVE'
    index: number
}