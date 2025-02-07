import React from 'react'
import {GAME_MODES} from 'Components/TicTacToe/constants/TicTacToeConstants'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'

const WinnerAnnouncement: React.FC = () => {
    const {state, dispatch} = useTicTacToeContext()
    const {gameMode, winner, playerLetter} = state

    const getWinnerText = () => {
        if (gameMode !== GAME_MODES.COMPUTER) {
            return winner
        }

        return winner === playerLetter ? 'You' : 'The Computer'
    }

    return winner ? (
        <>
            {/* @todo: Fix the better luck text. If player beats computer it makes no sense */}
            <span className="text-xl font-semibold">Better luck next time!</span>
            <span className="text-4xl font-bold">{getWinnerText()} Won!</span>
        </>
    ) : null
}

export default WinnerAnnouncement
