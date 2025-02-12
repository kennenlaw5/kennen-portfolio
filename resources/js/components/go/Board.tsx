import React from 'react'
import BoardRow from 'Components/go/BoardRow'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import styles from 'Sass/modules/GoGame.module.scss'

const Board: React.FC = () => {
    const {state: {squares}} = useGoGameContext()

    return <div className={styles.gameBoardContainer}>
        <div className={styles.gameBoard}>
            {squares.map((_, rowIndex) => (
                <BoardRow key={rowIndex} rowIndex={rowIndex} />
            ))}
        </div>
    </div>
}

export default Board
