import React from 'react'
import {GAME_MODES} from 'Components/TicTacToe/constants/TicTacToeConstants'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'
import GameResult from 'Components/TicTacToe/GameResult'
import TurnTracker from 'Components/TicTacToe/TurnTracker'

const BoardHelper: React.FC = () => {
    const {state, dispatch} = useTicTacToeContext()
    const {gameMode, isGameActive} = state

    return (
        <div className="flex flex-col items-center mb-4">
            <GameResult />
            <TurnTracker />
            {!isGameActive && gameMode === GAME_MODES.COMPUTER ? (
                <>
                    <span className="text-sm text-center">
                        Either click a cell to play first, or press "Start" to let the computer begin.
                    </span>
                    <button
                        onClick={() => dispatch({type: 'MAKE_COMPUTER_MOVE'})}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-600 transition-colors"
                    >
                        Start
                    </button>
                </>
            ) : null}
            {!isGameActive && gameMode !== GAME_MODES.COMPUTER ? (
                <span className="text-gray-400 text-sm text-center">Awaiting game...</span>
            ) : null}
        </div>
    )
}

export default BoardHelper
