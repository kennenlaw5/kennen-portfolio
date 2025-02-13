import React, {useEffect} from 'react'
import BoardRow from 'Components/go/BoardRow'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import styles from 'Sass/modules/GoGame.module.scss'

const Board: React.FC = () => {
    const {state: {isPlayerTurn, squares}, dispatch} = useGoGameContext()

    useEffect(() => {
        if (isPlayerTurn) {
            return
        }

        dispatch({type: 'SET_COMPUTER_SQUARE'})
    }, [isPlayerTurn])

    return <div className={styles.gameBoardContainer}>
        <div className={styles.gameBoard}>
            {squares.map((_, rowIndex) => (
                <BoardRow key={rowIndex} rowIndex={rowIndex} />
            ))}
        </div>
    </div>
}

export default Board
