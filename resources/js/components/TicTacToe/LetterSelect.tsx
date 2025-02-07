import React from 'react'
import {TGameMode, TPlayerLetter} from 'Components/TicTacToe/types/TicTacToeTypes'
import {PLAYER_LETTERS} from 'Components/TicTacToe/constants/TicTacToeConstants'
import { useTicTacToeContext } from './context/TicTacToeContext'

const LetterSelect: React.FC = () => {
  const {state, dispatch} = useTicTacToeContext()
  const {gameMode, isGameActive, playerLetter} = state
  const letterSelectLabel =
  gameMode === 'computer'
      ? 'Choose your letter:'
      : 'Who is going first?'

  return !isGameActive ? (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <label className="mr-2 font-medium">{letterSelectLabel}</label>
        <select
          value={playerLetter}
          onChange={({target: {value}}) => dispatch({type: 'SET_PLAYER_LETTER', payload: value})}
          className="border p-1 rounded"
        >
          <option value={PLAYER_LETTERS.X}>{PLAYER_LETTERS.X}</option>
          <option value={PLAYER_LETTERS.O}>{PLAYER_LETTERS.O}</option>
        </select>
      </div>
    </div>
  ) : null
}

export default LetterSelect