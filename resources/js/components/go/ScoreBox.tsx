import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/GoGame.module.scss'
import BoardStatus from 'Components/go/BoardStatus'
import {COLORS} from 'Components/go/constants/GoGameConsts'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {capitalize} from 'JS/helpers'

const ScoreBox: React.FC = () => {
    const {state: {scores}} = useGoGameContext()

    return (
        <div className={classNames(styles.gameBox, styles.gameBoxScore)}>
            <BoardStatus />
            <div className="my-auto"><b>{capitalize(COLORS.BLUE)} Score: </b>{scores[COLORS.BLUE]}</div>
            <div className="my-auto"><b>{capitalize(COLORS.RED)} Score:</b> {scores[COLORS.RED]}</div>
        </div>
    )
}

export default ScoreBox
