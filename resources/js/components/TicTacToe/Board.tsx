import React from 'react'
import classNames from 'classnames'
import {useTicTacToeContext} from 'Components/TicTacToe/context/TicTacToeContext'

const Board: React.FC = () => {
    const {state, dispatch} = useTicTacToeContext()
    const {board} = state
    const boardCellClass = 'flex items-center justify-center border border-blue-700 hover:bg-blue-50 transition-colors'

    return (
        <div className="flex justify-center">
            <div className="w-64 h-64 bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 grid-rows-3 h-full">
                    {board.map((cell, index) => (
                        <div
                            key={index}
                            className={classNames(boardCellClass, {
                                'cursor-pointer': !cell,
                                'cursor-not-allowed': cell,
                            })}
                            onClick={() => dispatch({type: 'MAKE_PLAYER_MOVE', index})}
                        >
                            <span className="text-3xl font-bold">{cell}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Board
