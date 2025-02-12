import React from 'react'
import {GAME_MODES} from 'Constants/gameConsts'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'

const WinnerAnnouncement: React.FC = () => {
    const {state} = useTicTacToeContext()
    const {gameMode, winner, playerLetter} = state

    const getWinnerText = () => {
        if (gameMode !== GAME_MODES.COMPUTER) {
            return winner
        }

        return winner === playerLetter ? 'You' : 'The Computer'
    }

    return winner ? (
        <>
            <span className="text-xl font-semibold">Game over!</span>
            <span className="text-4xl font-bold">{getWinnerText()} Won!</span>
        </>
    ) : null
}

export default WinnerAnnouncement
