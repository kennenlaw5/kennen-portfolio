import React, {lazy, useState} from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import {TfiLayoutGrid4Alt} from 'react-icons/tfi'
import Section from 'Components/Section'

const GoGame = lazy(() => import('Components/go/Go'))
const TicTacToe = lazy(() => import('Components/TicTacToe/TicTacToe'))
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
        <h2>{selectedGame === 'ticTacToe' ? 'Tic Tac Toe' : 'Square Off Pro'}</h2>
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

        {/* Square Off Pro Option */}
        <button
          onClick={() => setSelectedGame('go')}
          className="bg-blue-100 hover:scale-105 transition-transform p-6 rounded-lg shadow focus:outline-none"
        >
          <div className="flex flex-col items-center">
            {/* Icon Placeholder */}
            <span className="relative inline-block">
              <TfiLayoutGrid4Alt className='w-16 h-16 text-red-500' style={{
                clipPath: 'polygon(0 0, 100% 0, 0 100%, 0% 100%)' // Top-left triangle
              }} />
              <TfiLayoutGrid4Alt className='w-16 h-16 text-blue-500 absolute top-0 left-0' style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' // Bottom-right triangle
              }}/>
            </span>
            <span className="text-lg font-medium">Square Off Pro</span>
          </div>
        </button>
      </div>
    </Section>
  )
}

export default Games
