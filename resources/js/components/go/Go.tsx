import React from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import Board from 'Components/go/Board'
import {GoGameContextProvider} from 'Components/go/context/GoGameContext'
import BoardHelper from 'Components/go/BoardHelper'
import SquareOffRules from 'Components/go/SquareOffRules'

const GoGame: React.FC = () => (
    <GoGameContextProvider>
        <div className={styles.game}>
            <SquareOffRules />
            <BoardHelper />
            <Board />
        </div>
    </GoGameContextProvider>
)

export default GoGame
