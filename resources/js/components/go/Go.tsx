import React from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import Board from 'Components/go/Board'
import {GameAnnouncementProvider} from 'Components/go/context/GameAnnouncementContext'
import {GoGameContextProvider} from 'Components/go/context/GoGameContext'
import {BoardNavigationProvider} from 'Components/go/context/BoardNavigationContext'
import BoardHelper from 'Components/go/BoardHelper'
import SquareOffRules from 'Components/go/SquareOffRules'
import BoardGuide from 'Components/go/BoardGuide'
import LiveGameStatus from 'Components/go/LiveGameStatus'

const GoGame: React.FC = () => (
    <GoGameContextProvider>
        <BoardNavigationProvider>
            <GameAnnouncementProvider>
                <div className={styles.game}>
                    <SquareOffRules />
                    <BoardGuide />
                    <BoardHelper />
                    <LiveGameStatus />
                    <Board />
                </div>
            </GameAnnouncementProvider>
        </BoardNavigationProvider>
    </GoGameContextProvider>
)

export default GoGame
