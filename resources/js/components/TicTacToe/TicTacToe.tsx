import React from 'react'
import LetterSelect from 'Components/TicTacToe/LetterSelect'
import Board from 'Components/TicTacToe/Board'
import {TicTacToeProvider} from 'Components/TicTacToe/context/TicTacToeContext'
import ResetButton from 'Components/TicTacToe/ResetButton'
import ModeSelect from 'Components/TicTacToe/ModeSelect'
import BoardHelper from 'Components/TicTacToe/BoardHelper'

const TicTacToe: React.FC = () => (
  <TicTacToeProvider>
    <div className="p-8">
      <ModeSelect />
      <BoardHelper />
      <Board />
      <div className="flex justify-center mt-4">
        <LetterSelect />
        <ResetButton />
      </div>
    </div>
  </TicTacToeProvider>
)

export default TicTacToe
