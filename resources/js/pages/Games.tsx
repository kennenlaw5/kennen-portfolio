import React, {useState} from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import TicTacToe from 'Components/TicTacToe/TicTacToe'
import Section from 'Components/Section'

// @todo: Refactor this file
// Placeholder Go component
const GoGame: React.FC = () => {
  return (
    <>
      <h2 className="mb-4">GO</h2>
      <p className="text-gray-600">GO game coming soon...</p>
    </>
  )
}

type GameOption = 'none' | 'ticTacToe' | 'go'

const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameOption>('none')

  // Handler to go back to game selection
  const handleBack = () => {
    setSelectedGame('none')
  }

  return selectedGame !== 'none' ? (
    <Section>
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="mr-2 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft size={20} />
        </button>
        <h2>{selectedGame === 'ticTacToe' ? 'Tic Tac Toe' : 'GO'}</h2>
      </div>
      <div>
        {selectedGame === 'ticTacToe' ? <TicTacToe /> : <GoGame />}
      </div>
    </Section>
  ) : (
    <Section>
      <h2 className="mb-6">Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tic Tac Toe Option */}
        <button
          onClick={() => setSelectedGame('ticTacToe')}
          className="bg-blue-100 hover:scale-105 transition-transform p-6 rounded-lg shadow focus:outline-none"
        >
          <div className="flex flex-col items-center">
            <img src="/svg/tic-tac-toe.svg" alt="Tic-Tac-Toe Logo" className="w-16 h-16 object-contain" />
            <span className="text-lg font-medium">Tic Tac Toe</span>
          </div>
        </button>

        {/* GO Option */}
        <button
          onClick={() => setSelectedGame('go')}
          className="bg-blue-100 hover:scale-105 transition-transform p-6 rounded-lg shadow focus:outline-none"
        >
          <div className="flex flex-col items-center">
            {/* Icon Placeholder */}
            <div className="bg-blue-300 h-16 w-16 mb-4 rounded-full flex items-center justify-center">
              {/* Replace with an icon/image as needed */}
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-lg font-medium">GO</span>
          </div>
        </button>
      </div>
    </Section>
  )
}

export default Games
