import React from 'react'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'

const ResetButton: React.FC = () => {
    const {state: {isGameActive}, dispatch} = useTicTacToeContext()

    return isGameActive ? (
        <button
            onClick={() => dispatch({type: 'RESET_GAME'})}
            className="rounded-lg border border-rose-400/60 bg-rose-500/20 px-4 py-2 font-semibold text-rose-100 shadow-md shadow-rose-500/15 transition hover:border-rose-300/80 hover:bg-rose-500/30 hover:shadow-rose-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
        >
            Reset
        </button>
    ) : null
}

export default ResetButton
