import React, {useEffect} from 'react'
import BoardRow from 'Components/go/BoardRow'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {
    BOARD_DIMENSIONS,
    BOARD_INSTRUCTIONS_ID,
    BOARD_STATUS_ID,
    COMPUTER_MOVE_DELAY_MS
} from 'Components/go/constants/GoGameConsts'
import styles from 'Sass/modules/GoGame.module.scss'

const Board: React.FC = () => {
    const {state: {isPlayerTurn, squares}, dispatch} = useGoGameContext()

    useEffect(() => {
        if (isPlayerTurn) {
            return
        }

        const computerTurn = window.setTimeout(() => {
            dispatch({type: 'SET_COMPUTER_SQUARE'})
        }, COMPUTER_MOVE_DELAY_MS)

        return () => window.clearTimeout(computerTurn)
    }, [dispatch, isPlayerTurn])

    return <div className={styles.gameBoardContainer}>
        <div
            className={styles.gameBoard}
            role="grid"
            aria-label="Square Off Pro game board"
            aria-describedby={`${BOARD_INSTRUCTIONS_ID} ${BOARD_STATUS_ID}`}
            aria-rowcount={BOARD_DIMENSIONS.ROWS}
            aria-colcount={BOARD_DIMENSIONS.COLS}
            aria-busy={!isPlayerTurn}
        >
            {squares.map((_, rowIndex) => (
                <BoardRow key={rowIndex} rowIndex={rowIndex} />
            ))}
        </div>
    </div>
}

export default Board
