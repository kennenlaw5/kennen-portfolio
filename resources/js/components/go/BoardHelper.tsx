import React from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import ScoreBox from 'Components/go/ScoreBox'
import ControlBox from 'Components/go/ControlBox'
import ModeSelectBox from 'Components/go/ModeSelectBox'

const BoardHelper: React.FC = () => (
    <div className={styles.gameInfo}>
        <ModeSelectBox />
        <ScoreBox />
        <ControlBox />
    </div>
)

export default BoardHelper
