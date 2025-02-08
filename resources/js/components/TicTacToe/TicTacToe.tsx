import React from 'react'
import LetterSelect from 'Components/TicTacToe/LetterSelect'
import Board from 'Components/TicTacToe/Board'
import {TicTacToeProvider} from 'Components/TicTacToe/context/TicTacToeContext'
import ResetButton from 'Components/TicTacToe/ResetButton'
import ModeSelect from 'Components/TicTacToe/ModeSelect'
import BoardHelper from 'Components/TicTacToe/BoardHelper'

const TicTacToe: React.FC = () => (
  <TicTacToeProvider>
    <ModeSelect />
    <BoardHelper />
    <Board />
    <div className="flex justify-center mt-4">
      <LetterSelect />
      <ResetButton />
    </div>
  </TicTacToeProvider>
)

export default TicTacToe
