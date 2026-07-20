import React, {useEffect} from 'react'
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
    const hasUndoableMove = currentMove > 0 && currentMove < maxMoves
    const canUndo = hasUndoableMove && isPlayerTurn
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

    useEffect(() => {
        const handleUndoShortcut = (event: KeyboardEvent) => {
            const isUndoShortcut = (event.ctrlKey || event.metaKey)
                && !event.altKey
                && !event.shiftKey
                && event.key.toLowerCase() === 'z'

            if (!isUndoShortcut || !canUndo) {
                return
            }

            event.preventDefault()
            dispatch({type: 'UNDO_MOVE'})
        }

        window.addEventListener('keydown', handleUndoShortcut)

        return () => window.removeEventListener('keydown', handleUndoShortcut)
    }, [canUndo, dispatch])

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
            {hasUndoableMove ? (
                <div className={styles.gameBoxButtonContainer}>
                    <button
                        className={classNames(styles.gameButton, styles.gameButtonWarning)}
                        onClick={previousMove}
                        disabled={!canUndo}
                    >
                        Undo {capitalize(previousMoveColor)} @ ({previousRow}, {previousColumn})
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default ControlBox
