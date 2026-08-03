import React, {useCallback, useMemo, useRef, useState} from 'react'
import {BOARD_DIMENSIONS} from 'Components/go/constants/GoGameConsts'
import {TMoveLocation} from 'Components/go/types/GoGameTypes'

const getCellKey = (row: number, column: number) => `${row}:${column}`

const getNextLocation = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    row: number,
    column: number
): TMoveLocation | null => {
    const lastRow = BOARD_DIMENSIONS.ROWS - 1
    const lastColumn = BOARD_DIMENSIONS.COLS - 1
    // Alt, Meta and Shift combinations belong to the browser and the platform, so they must reach
    // their default handlers instead of moving board focus.
    const isUnmodified = !event.altKey && !event.metaKey && !event.shiftKey

    if (!isUnmodified) {
        return null
    }

    switch (event.key) {
        case 'ArrowUp':
            return event.ctrlKey ? null : {row: Math.max(0, row - 1), column}
        case 'ArrowDown':
            return event.ctrlKey ? null : {row: Math.min(lastRow, row + 1), column}
        case 'ArrowLeft':
            return event.ctrlKey ? null : {row, column: Math.max(0, column - 1)}
        case 'ArrowRight':
            return event.ctrlKey ? null : {row, column: Math.min(lastColumn, column + 1)}
        case 'Home':
            return event.ctrlKey ? {row: 0, column: 0} : {row, column: 0}
        case 'End':
            return event.ctrlKey
                ? {row: lastRow, column: lastColumn}
                : {row, column: lastColumn}
        default:
            return null
    }
}

const useBoardNavigation = () => {
    const [activeLocation, setActiveLocation] = useState<TMoveLocation>({row: 0, column: 0})
    const cellRefs = useRef(new Map<string, HTMLButtonElement>())

    const registerCell = useCallback((row: number, column: number, cell: HTMLButtonElement | null) => {
        const key = getCellKey(row, column)

        if (cell) {
            cellRefs.current.set(key, cell)
        } else {
            cellRefs.current.delete(key)
        }
    }, [])

    // Focus and keyboard movement both report the same coordinate, so the previous state object is
    // reused when nothing moved to keep a single keypress from re-rendering the whole board twice.
    const activateLocation = useCallback((row: number, column: number) => {
        setActiveLocation(current => (
            current.row === row && current.column === column ? current : {row, column}
        ))
    }, [])

    const handleKeyDown = useCallback((
        event: React.KeyboardEvent<HTMLButtonElement>,
        row: number,
        column: number
    ) => {
        const nextLocation = getNextLocation(event, row, column)

        if (!nextLocation) {
            return
        }

        event.preventDefault()

        if (nextLocation.row === row && nextLocation.column === column) {
            return
        }

        activateLocation(nextLocation.row, nextLocation.column)
        cellRefs.current.get(getCellKey(nextLocation.row, nextLocation.column))?.focus()
    }, [activateLocation])

    const resetActiveLocation = useCallback(() => {
        activateLocation(0, 0)
    }, [activateLocation])

    return useMemo(() => ({
        activateLocation,
        activeLocation,
        handleKeyDown,
        registerCell,
        resetActiveLocation,
    }), [activateLocation, activeLocation, handleKeyDown, registerCell, resetActiveLocation])
}

export type TBoardNavigation = ReturnType<typeof useBoardNavigation>

export default useBoardNavigation
