import React from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import Board from 'Components/go/Board'
import {GoGameContextProvider} from 'Components/go/context/GoGameContext'
import BoardHelper from 'Components/go/BoardHelper'

const GoGame: React.FC = () => (
    <GoGameContextProvider>
        <div className={styles.game}>
            <BoardHelper />
            <Board />
        </div>
    </GoGameContextProvider>
)

export default GoGame
