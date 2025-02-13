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
        previousMoves,
        isPlayerTurn,
    } = state
    const canResetBoard = currentMove > 0 && isPlayerTurn
    const previousMoveColor = versus === GAME_MODES.COMPUTER ? nextColor : previousColor
    const previousMoveOffset = versus === GAME_MODES.COMPUTER ? 2 : 1
    const {
        row: previousRow,
        column: previousColumn
    } = previousMoves.locations[currentMove - previousMoveOffset] || {}

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
                    disabled={!canResetBoard}
                >
                    Reset Board
                </button>
            </div>
            {currentMove > 0 && currentMove < maxMoves ? (
                <div className={styles.gameBoxButtonContainer}>
                    <button
                        className={classNames(styles.gameButton, styles.gameButtonWarning)}
                        onClick={previousMove}
                        disabled={!isPlayerTurn}
                    >
                        Undo {capitalize(previousMoveColor)} @ ({previousRow}, {previousColumn})
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default ControlBox
