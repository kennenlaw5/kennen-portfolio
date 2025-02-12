import React, {createContext, useReducer, useContext} from 'react'
import {PLAYER_LETTERS} from 'Components/TicTacToe/constants/TicTacToeConstants'
import {
    Action,
    TMakePlayerMoveAction,
    TTicTacToeContextProps,
    TTicTacToeContextProviderProps,
    TTicTacToeState
} from 'Components/TicTacToe/types/TicTacToeTypes'
import {getIsWinningMove, getComputerMove} from 'Components/TicTacToe/helpers'
import {DIFFICULTIES, GAME_MODES} from 'Constants/gameConsts'

const initialState: TTicTacToeState = {
  gameMode: GAME_MODES.COMPUTER,
  difficulty: DIFFICULTIES.NORMAL,
  playerLetter: PLAYER_LETTERS.X,
  currentTurn: PLAYER_LETTERS.X,
  board: Array(9).fill(''),
  isGameActive: false,
  winner: null,
  isBoardFull: false,
}

const getIsBoardFull = (board: string[]): boolean => board.every(cell => cell)

const makePlayerMove = (state: TTicTacToeState, action: TMakePlayerMoveAction): TTicTacToeState => {
    const {index} = action

    if (state.board[index] !== '' || state.winner) {
      return state
    }

    const newBoard = [...state.board]
    newBoard[index] = state.currentTurn

    if (getIsWinningMove(newBoard, index)) {
      return {
        ...state,
        board: newBoard,
        winner: state.currentTurn,
      }
    }

    const isBoardFull = getIsBoardFull(newBoard)

    if (state.gameMode !== GAME_MODES.COMPUTER || isBoardFull) {
      return {
        ...state,
        board: newBoard,
        currentTurn: state.currentTurn === PLAYER_LETTERS.X ? PLAYER_LETTERS.O : PLAYER_LETTERS.X,
        isGameActive: true,
        isBoardFull,
      }
    }

    return makeComputerMove({...state, board: newBoard})
}

const makeComputerMove = (state: TTicTacToeState): TTicTacToeState => {
  const computerLetter = state.playerLetter === PLAYER_LETTERS.X ? PLAYER_LETTERS.O : PLAYER_LETTERS.X
  const computerMoveIndex = getComputerMove(state.board, state.difficulty, computerLetter)
  const newBoard = [...state.board]
  newBoard[computerMoveIndex] = computerLetter
  const isBoardFull = getIsBoardFull(newBoard)
  const newState = {
    ...state,
    board: newBoard,
    isBoardFull,
    isGameActive: true,
  }

  return getIsWinningMove(newBoard, computerMoveIndex) 
    ? {...newState, winner: computerLetter}
    : newState
}

const reducer = (state: TTicTacToeState, action: Action): TTicTacToeState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {...state, [action.payload.field]: action.payload.value}
    case 'SET_PLAYER_LETTER':
      return {...state, playerLetter: action.payload, currentTurn: action.payload}
    case 'START_GAME':
      return { ...state, isGameActive: true }
    case 'RESET_GAME':
      return {
        ...state,
        board: Array(9).fill(''),
        isGameActive: false,
        currentTurn: state.playerLetter,
        winner: null,
        isBoardFull: false,
      }
    case 'MAKE_PLAYER_MOVE':
      return makePlayerMove(state, action)
    case 'MAKE_COMPUTER_MOVE':
      return makeComputerMove(state)
    default:
      return state
  }
}

const TicTacToeContext = createContext<TTicTacToeContextProps | undefined>(undefined)

export const useTicTacToeContext = (): TTicTacToeContextProps => {
  const context = useContext(TicTacToeContext)

  if (!context) {
    throw new Error('useTicTacToeContext must be used within a TicTacToeContextProvider')
  }

  return context
}

export const TicTacToeContextProvider: React.FC<TTicTacToeContextProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <TicTacToeContext.Provider value={{ state, dispatch }}>
      {children}
    </TicTacToeContext.Provider>
  )
}
