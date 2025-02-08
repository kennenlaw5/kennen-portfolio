import React from 'react'
import LetterSelect from 'Components/TicTacToe/LetterSelect'
import {TicTacToeProvider} from 'Components/TicTacToe/context/TicTacToeContext'
import Board from 'Components/TicTacToe/Board'
import BoardHelper from 'Components/TicTacToe/BoardHelper'
import ModeSelect from 'Components/TicTacToe/ModeSelect'
import ResetButton from 'Components/TicTacToe/ResetButton'

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
