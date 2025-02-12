import React from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import classNames from 'classnames'
import {DIFFICULTIES, GAME_MODES} from 'Constants/gameConsts'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {capitalize} from 'JS/helpers'

const ModeSelectBox: React.FC = () => {
    const {state, dispatch} = useGoGameContext()
    const {
        versus,
        level,
        currentMove,
    } = state
    const allowSelect = currentMove === 0

    const handleVersusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!allowSelect) {
            return
        }

        dispatch({type: 'SET_VERSUS', versus: e.target.value})
    }

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!allowSelect) {
            return
        }

        dispatch({type: 'SET_LEVEL', level: e.target.value})
    }

    return (
        <div className={styles.gameBox}>
            <div className={styles.gameBoxButtonContainer}>
                <label className={styles.gameBoxLabel} htmlFor="versus">Versus: </label>
                <div className="inline-block relative w-32">
                    <select
                        className={styles.gameBoxSelect}
                        name="versus"
                        id="versus"
                        onChange={handleVersusChange}
                        value={versus}
                        disabled={!allowSelect}
                    >
                        {/* @TODO: Add back once ai is implemented */}
                        {/* {Object.values(GAME_MODES).map((mode) => (
                            <option key={mode} value={mode}>
                                {capitalize(mode)}
                            </option>
                        ))} */}
                        <option disabled>Coming soon!</option>
                        <option value={GAME_MODES.PERSON}>Person</option>
                    </select>
                </div>
            </div>
            {versus === GAME_MODES.COMPUTER ? (
                <div className={styles.gameBoxButtonContainer}>
                    <label className={styles.gameBoxLabel} htmlFor="level">Difficulty: </label>
                    <select 
                        name="level"
                        id="level"
                        value={level}
                        onChange={handleLevelChange}
                        disabled={!allowSelect}
                        className={classNames(styles.gameBoxSelect, styles.gameDifficulty, {
                            [styles.gameBoxSelectDanger]: level === DIFFICULTIES.HARD,
                            [styles.gameBoxSelectWarning]: level === DIFFICULTIES.NORMAL,
                            [styles.gameBoxSelectSuccess]: level === DIFFICULTIES.EASY,
                        })}
                    >
                        {Object.values(DIFFICULTIES).map((difficulty) => (
                            <option key={difficulty} value={difficulty}>{capitalize(difficulty)}</option>
                        ))}
                    </select>
                </div>
            ) : null}
        </div>
    )
}

export default ModeSelectBox
