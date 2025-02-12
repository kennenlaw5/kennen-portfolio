import React from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import classNames from 'classnames'
import {GAME_MODES} from 'Constants/gameConsts'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {capitalize} from 'JS/helpers'

const ControlBox: React.FC = () => {
    const {state, dispatch} = useGoGameContext();
    const {
        nextColor,
        previousColor,
        versus,
        currentMove,
        maxMoves,
        previousMoves
    } = state
    const previousMoveColor = versus === GAME_MODES.COMPUTER ? nextColor : previousColor
    const {row: previousRow, column: previousColumn} = previousMoves.locations[currentMove - 1] || {}

    const previousMove = () => {
       dispatch({type: 'UNDO_MOVE'})
    }

    const clear = () => {
       dispatch({type: 'RESET_BOARD'})
    }

    return (
        <div className={styles.gameBox}>
            <div className={styles.gameBoxButtonContainer}>
                <button
                    className={classNames(styles.gameButton, styles.gameButtonDanger)}
                    onClick={clear}
                    disabled={currentMove === 0}
                >
                    Reset Board
                </button>
            </div>
            {currentMove > 0 && currentMove < maxMoves ? (
                <div className={styles.gameBoxButtonContainer}>
                    <button
                        className={classNames(styles.gameButton, styles.gameButtonWarning)}
                        onClick={previousMove}
                    >
                        Undo {capitalize(previousMoveColor)} @ ({previousRow}, {previousColumn})
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default ControlBox
