import React, {useCallback} from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/GoGame.module.scss'
import {COLORS} from 'Components/go/constants/GoGameConsts'
import {useGameAnnouncer} from 'Components/go/context/GameAnnouncementContext'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {useBoardNavigationContext} from 'Components/go/context/BoardNavigationContext'
import {capitalize} from 'JS/helpers'

type TSquareProps = {
    rowIndex: number
    columnIndex: number
}

const Square: React.FC<TSquareProps> = ({rowIndex, columnIndex}) => {
    const {state, dispatch} = useGoGameContext()
    const {
        activeLocation,
        activateLocation,
        handleKeyDown,
        registerCell: registerNavigationCell,
    } = useBoardNavigationContext()
    const announce = useGameAnnouncer()
    const {currentMove, maxMoves, nextColor, squares, winner, isPlayerTurn} = state
    const currentColor = squares[rowIndex][columnIndex]
    const shouldFadeSquare = winner && winner !== currentColor
    const isGameOver = currentMove === maxMoves
    // Availability describes the square itself. Folding the computer's turn into it would rewrite
    // the name and state of all 100 cells twice per computer move, which screen readers re-announce
    // for whichever cell holds focus; the grid's aria-busy carries the pending turn instead.
    const isAvailable = !currentColor && !isGameOver
    const isClaimable = isAvailable && isPlayerTurn
    const ownership = currentColor ? capitalize(currentColor) : 'empty'
    const availability = isAvailable ? 'available' : 'unavailable'
    const accessibleName = `Row ${rowIndex + 1}, column ${columnIndex + 1}: ${ownership}, ${availability}`
    const isActive = activeLocation.row === rowIndex
        && activeLocation.column === columnIndex
    const registerCell = useCallback((cell: HTMLButtonElement | null) => {
        registerNavigationCell(rowIndex, columnIndex, cell)
    }, [columnIndex, registerNavigationCell, rowIndex])

    const handleClick = () => {
        if (isGameOver) {
            announce('The game is complete. Reset the board to play again.')
            return
        }

        if (currentColor) {
            announce(`Row ${rowIndex + 1}, column ${columnIndex + 1} is already claimed by ${capitalize(currentColor)}.`)
            return
        }

        if (!isPlayerTurn) {
            announce('Wait for the computer to finish its turn.')
            return
        }

        dispatch({
            type: 'SET_SQUARE',
            row: rowIndex,
            column: columnIndex,
        })
    }

    return (
        <div className={styles.gameBoardCell} role="gridcell" aria-colindex={columnIndex + 1}>
            <button
                type="button"
                ref={registerCell}
                className={classNames(styles.gameSquare, {
                    [styles.gameSquareRed]: currentColor === COLORS.RED,
                    [styles.gameSquareBlue]: currentColor === COLORS.BLUE,
                    [styles.gameSquareRedHover]: isClaimable && nextColor === COLORS.RED,
                    [styles.gameSquareBlueHover]: isClaimable && nextColor === COLORS.BLUE,
                    [styles.gameSquareFade]: shouldFadeSquare,
                })}
                aria-label={accessibleName}
                aria-disabled={!isAvailable}
                tabIndex={isActive ? 0 : -1}
                onClick={handleClick}
                onFocus={() => activateLocation(rowIndex, columnIndex)}
                onKeyDown={event => handleKeyDown(event, rowIndex, columnIndex)}
            >
                {currentColor ? (
                    <span className={styles.gameSquareMarker} aria-hidden="true">
                        {currentColor.charAt(0).toUpperCase()}
                    </span>
                ) : null}
            </button>
        </div>
    )
}

export default Square
