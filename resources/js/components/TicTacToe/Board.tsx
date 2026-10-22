import React from 'react'
import classNames from 'classnames'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'
import {PLAYER_LETTERS} from 'Components/TicTacToe/constants/TicTacToeConstants'

const Board: React.FC = () => {
    const {state, dispatch} = useTicTacToeContext()
    const {board} = state
    const boardCellClass = 'flex items-center justify-center border border-white/10 hover:bg-cyan-400/10 transition-colors'

    return (
        <div className="flex justify-center">
            <div className="surface w-64 h-64 overflow-hidden">
                <div className="grid grid-cols-3 grid-rows-3 h-full">
                    {board.map((cell, index) => (
                        // The existing Tic Tac Toe board remains outside the current accessibility scope.
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div
                            key={index}
                            className={classNames(boardCellClass, {
                                'cursor-pointer': !cell,
                                'cursor-not-allowed': cell,
                            })}
                            onClick={() => dispatch({type: 'MAKE_PLAYER_MOVE', index})}
                        >
                            <span className={classNames('text-3xl font-bold', {
                                'text-cyan-300': cell === PLAYER_LETTERS.X,
                                'text-violet-300': cell === PLAYER_LETTERS.O,
                            })}>{cell}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Board
