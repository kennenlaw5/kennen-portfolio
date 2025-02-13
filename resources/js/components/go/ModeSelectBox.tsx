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
        difficulty,
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

        dispatch({type: 'SET_LEVEL', difficulty: e.target.value})
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
                        {Object.values(GAME_MODES).map((mode) => (
                            <option key={mode} value={mode}>
                                {capitalize(mode)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {versus === GAME_MODES.COMPUTER ? (
                <div className={styles.gameBoxButtonContainer}>
                    <label className={styles.gameBoxLabel} htmlFor="difficulty">Difficulty: </label>
                    <select 
                        name="difficulty"
                        id="difficulty"
                        value={difficulty}
                        onChange={handleLevelChange}
                        disabled={!allowSelect}
                        className={classNames(styles.gameBoxSelect, styles.gameDifficulty, {
                            [styles.gameBoxSelectDanger]: difficulty === DIFFICULTIES.HARD,
                            [styles.gameBoxSelectWarning]: difficulty === DIFFICULTIES.NORMAL,
                            [styles.gameBoxSelectSuccess]: difficulty === DIFFICULTIES.EASY,
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
