import React, {createContext, useContext, useReducer} from 'react'
import {setSquare, undoMove} from 'Components/go/helpers'
import {setComputerSquare} from 'Components/go/aiHelpers'
import {BOARD_DIMENSIONS, COLORS} from 'Components/go/constants/GoGameConsts'
import {DIFFICULTIES, GAME_MODES} from 'Constants/gameConsts'
import {
    TGameState,
    TGoGameContextProps,
    TGoGameContextProviderProps,
    TReducerAction
} from 'Components/go/types/GoGameTypes'

export const initialState: TGameState = {
  squares: Array(BOARD_DIMENSIONS.ROWS).fill(null).map(() => Array(BOARD_DIMENSIONS.COLS).fill(null)),
  previousMoves: {
    locations: [],
    moves: [],
  },
  currentMove: 0,
  maxMoves: BOARD_DIMENSIONS.COLS * BOARD_DIMENSIONS.ROWS,
  nextColor: COLORS.RED,
  previousColor: COLORS.BLUE,
  isPlayerTurn: true,
  previousMoveOffset: 1,
  scores: {
    [COLORS.RED]: 0,
    [COLORS.BLUE]: 0,
  },
  versus: GAME_MODES.PERSON,
  difficulty: DIFFICULTIES.NORMAL,
  winner: null,
}

const reducer = (state: TGameState, action: TReducerAction): TGameState => {
    switch (action.type) {
        case 'SET_SQUARE': {
            return setSquare(state, action)
        }
        case 'SET_COMPUTER_SQUARE': {
            return setComputerSquare(state)
        }
        case 'UNDO_MOVE': {
            return undoMove(state)
        }
        case 'RESET_BOARD':
            return {
                ...initialState,
                versus: state.versus,
                difficulty: state.difficulty,
                previousMoveOffset: state.previousMoveOffset,
            }
        case 'SET_VERSUS':
            return {
                ...initialState,
                versus: action.versus,
                difficulty: state.difficulty,
                previousMoveOffset: initialState.previousMoveOffset + (action.versus === GAME_MODES.COMPUTER ? 1 : 0),
            }
        case 'SET_LEVEL':
            return {...state, difficulty: action.difficulty}
        default:
            return state
    }
}

const GoGameContext = createContext<TGoGameContextProps | undefined>(undefined)

export const useGoGameContext = (): TGoGameContextProps => {
  const context = useContext(GoGameContext)

  if (!context) {
    throw new Error('useGoGameContext must be used within a TicTacToeProvider')
  }

  return context
}

export const GoGameContextProvider: React.FC<TGoGameContextProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <GoGameContext.Provider value={{state, dispatch}}>
      {children}
    </GoGameContext.Provider>
  )
}
