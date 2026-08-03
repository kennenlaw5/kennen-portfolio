import React from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import classNames from 'classnames'
import {initialState, useGoGameContext} from 'Components/go/context/GoGameContext'
import {useBoardNavigationContext} from 'Components/go/context/BoardNavigationContext'
import {useGameAnnouncer} from 'Components/go/context/GameAnnouncementContext'
import useUndoControl from 'Components/go/hooks/useUndoControl'
import {capitalize} from 'JS/helpers'

const ControlBox: React.FC = () => {
    const {state, dispatch} = useGoGameContext()
    const {resetActiveLocation} = useBoardNavigationContext()
    const announce = useGameAnnouncer()
    const {currentMove, isPlayerTurn} = state
    const canResetBoard = currentMove > 0 && isPlayerTurn
    const {canUndo, undo, undoAccessibleLabel, undoLabel} = useUndoControl()

    const clear = () => {
        if (!canResetBoard) {
            announce(isPlayerTurn
                ? 'The board is already empty.'
                : 'Wait for the computer to finish its turn.')

            return
        }

        dispatch({type: 'RESET_BOARD'})
        resetActiveLocation()
        announce(`Board reset. ${capitalize(initialState.nextColor)} moves first.`)
    }

    return (
        <div className={styles.gameBox}>
            <div className={styles.gameBoxButtonContainer}>
                <button
                    className={classNames(styles.gameButton, styles.gameButtonDanger)}
                    onClick={clear}
                    aria-disabled={!canResetBoard}
                >
                    Reset Board
                </button>
            </div>
            <div className={styles.gameBoxButtonContainer}>
                <button
                    className={classNames(styles.gameButton, styles.gameButtonWarning)}
                    onClick={undo}
                    aria-disabled={!canUndo}
                    aria-label={undoAccessibleLabel}
                >
                    {undoLabel}
                </button>
            </div>
        </div>
    )
}

export default ControlBox
