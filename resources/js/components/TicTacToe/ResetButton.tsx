import React from 'react'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'

const ResetButton: React.FC = () => {
    const {state: {isGameActive}, dispatch} = useTicTacToeContext()

    return isGameActive ? (
        <button
            onClick={() => dispatch({type: 'RESET_GAME'})}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
            Reset
        </button>
    ) : null
}

export default ResetButton
