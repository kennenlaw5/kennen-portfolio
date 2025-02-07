import React from 'react'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'

const TieAnnouncement: React.FC = () => {
    const {state, dispatch} = useTicTacToeContext()
    const {winner, isBoardFull} = state

    return !winner && isBoardFull ? (
        <>
            <span className="text-xl font-semibold">Better luck next time!</span>
            <span className="text-4xl font-bold">Tied Game!</span>
        </>
) : null
}

export default TieAnnouncement
