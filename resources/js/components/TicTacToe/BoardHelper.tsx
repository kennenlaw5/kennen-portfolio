import React from 'react'
import {GAME_MODES} from 'Constants/gameConsts'
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
                        className="button button-primary mt-2 px-4 py-1.5 text-sm"
                    >
                        Start
                    </button>
                </>
            ) : null}
            {!isGameActive && gameMode !== GAME_MODES.COMPUTER ? (
                <span className="text-slate-400 text-sm text-center">Awaiting game...</span>
            ) : null}
        </div>
    )
}

export default BoardHelper
