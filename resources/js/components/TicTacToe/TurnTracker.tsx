import React from 'react'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'

const TurnTracker: React.FC = () => {
    const {state, dispatch} = useTicTacToeContext()
    const {isGameActive, winner, isBoardFull, currentTurn} = state

    return isGameActive && !isBoardFull && !winner ? (
        <>
            <span className="text-xl font-semibold">Turn</span>
            <span className="text-4xl font-bold">{currentTurn}</span>
        </>
    ) : null
}

export default TurnTracker
