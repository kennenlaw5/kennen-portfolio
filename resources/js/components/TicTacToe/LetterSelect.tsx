import React from 'react'
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
          {Object.values(PLAYER_LETTERS).map((letter) => (
            <option key={letter} value={letter}>{letter}</option>
          ))}
        </select>
      </div>
    </div>
  ) : null
}

export default LetterSelect