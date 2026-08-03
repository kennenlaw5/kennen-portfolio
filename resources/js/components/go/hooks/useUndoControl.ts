import {useCallback, useEffect, useLayoutEffect, useRef} from 'react'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {useGameAnnouncer} from 'Components/go/context/GameAnnouncementContext'
import {capitalize} from 'JS/helpers'

const useUndoControl = () => {
    const {state, dispatch} = useGoGameContext()
    const announce = useGameAnnouncer()
    const {
        currentMove,
        isPlayerTurn,
        maxMoves,
        nextColor,
        previousColor,
        previousMoves,
        previousMoveOffset,
    } = state
    const isGameOver = currentMove === maxMoves
    const hasUndoableMove = currentMove >= previousMoveOffset && !isGameOver
    const canUndo = hasUndoableMove && isPlayerTurn
    const undoDescriptions = previousMoves.locations
        .slice(Math.max(currentMove - previousMoveOffset, 0), currentMove)
        .map((location, index, locations) => {
            const color = (locations.length - 1 - index) % 2 === 0
                ? previousColor
                : nextColor

            return `${capitalize(color)} at row ${location.row}, column ${location.column}`
        })
    const undoSummary = undoDescriptions.join(' and ')
    const previousMove = previousMoves.locations[
        Math.max(currentMove - previousMoveOffset, 0)
    ]
    const previousMoveColor = previousMoveOffset > 1 ? nextColor : previousColor
    const undoLabel = hasUndoableMove && previousMove
        ? `Undo ${capitalize(previousMoveColor)} @ (${previousMove.row}, ${previousMove.column})`
        : 'Undo last move'
    const undoAccessibleLabel = hasUndoableMove && undoDescriptions.length > 1
        ? `${undoLabel}. Also undoes ${undoDescriptions.slice(1).join(' and ')}`
        : undoLabel
    const undo = useCallback(() => {
        if (!canUndo) {
            if (!isPlayerTurn) {
                announce('Wait for the computer to finish its turn.')
            } else if (isGameOver) {
                announce('The game is complete. Reset the board to play again.')
            } else {
                announce('There is no move to undo.')
            }

            return
        }

        dispatch({type: 'UNDO_MOVE'})
        announce(`Undid ${undoSummary}.`)
    }, [announce, canUndo, dispatch, isGameOver, isPlayerTurn, undoSummary])
    const undoRef = useRef(undo)
    const canUndoRef = useRef(canUndo)

    useLayoutEffect(() => {
        undoRef.current = undo
        canUndoRef.current = canUndo
    }, [canUndo, undo])

    useEffect(() => {
        const handleUndoShortcut = (event: KeyboardEvent) => {
            const isUndoShortcut = (event.ctrlKey || event.metaKey)
                && !event.altKey
                && !event.shiftKey
                && event.key.toLowerCase() === 'z'

            if (!isUndoShortcut) {
                return
            }

            if (canUndoRef.current) {
                event.preventDefault()
            }

            undoRef.current()
        }

        window.addEventListener('keydown', handleUndoShortcut)

        return () => window.removeEventListener('keydown', handleUndoShortcut)
    }, [])

    return {
        canUndo,
        undo,
        undoAccessibleLabel,
        undoLabel,
    }
}

export default useUndoControl
