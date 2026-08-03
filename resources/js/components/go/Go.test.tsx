import React, {useLayoutEffect, useRef} from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import GoGame from 'Components/go/Go'
import ControlBox from 'Components/go/ControlBox'
import LiveGameStatus from 'Components/go/LiveGameStatus'
import {GameAnnouncementProvider} from 'Components/go/context/GameAnnouncementContext'
import {
    GoGameContextProvider,
    useGoGameContext,
} from 'Components/go/context/GoGameContext'
import {BoardNavigationProvider} from 'Components/go/context/BoardNavigationContext'

const UndoAfterMoveCommit: React.FC = () => {
    const {state, dispatch} = useGoGameContext()
    const started = useRef(false)
    const requestedUndo = useRef(false)

    useLayoutEffect(() => {
        if (!started.current) {
            started.current = true
            dispatch({type: 'SET_SQUARE', row: 0, column: 0})

            return
        }

        if (state.currentMove === 1 && !requestedUndo.current) {
            requestedUndo.current = true
            window.dispatchEvent(new KeyboardEvent('keydown', {
                bubbles: true,
                ctrlKey: true,
                key: 'z',
            }))
        }
    }, [dispatch, state.currentMove])

    return null
}

describe('Square Off Pro controls', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('undoes the latest move with Ctrl+Z and Command+Z', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const firstSquare = screen.getByRole('button', {
            name: 'Row 1, column 1: empty, available',
        })

        await user.click(firstSquare)

        expect(screen.getByRole('button', {name: /^Undo/})).toHaveAttribute('aria-disabled', 'false')

        const availableUndoShortcut = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'z',
            metaKey: true,
        })

        fireEvent(window, availableUndoShortcut)

        expect(screen.getByRole('button', {name: 'Undo last move'})).toHaveAttribute(
            'aria-disabled',
            'true'
        )
        expect(availableUndoShortcut.defaultPrevented).toBe(true)

        await user.click(firstSquare)

        expect(screen.getByRole('button', {name: /^Undo/})).toHaveAttribute('aria-disabled', 'false')

        await user.keyboard('{Control>}z{/Control}')

        expect(screen.getByRole('button', {name: 'Undo last move'})).toHaveAttribute(
            'aria-disabled',
            'true'
        )
    })

    it('announces one summarized status for moves without moving focus', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const firstSquare = screen.getByRole('button', {
            name: 'Row 1, column 1: empty, available',
        })

        firstSquare.focus()
        await user.keyboard('{Enter}')

        expect(firstSquare).toHaveFocus()
        expect(screen.getByRole('status')).toHaveTextContent(
            'Red played row 1, column 1. Score: Red 1, Blue 0. Next player: Blue.'
        )
    })

    it('announces computer pending and resolved states once without moving focus', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)
        const user = userEvent.setup()

        render(<GoGame />)

        await user.selectOptions(screen.getByRole('combobox', {name: 'Versus:'}), 'computer')

        const firstSquare = screen.getByRole('button', {
            name: 'Row 1, column 1: empty, available',
        })
        const board = screen.getByRole('grid', {name: 'Square Off Pro game board'})

        firstSquare.focus()
        fireEvent.click(firstSquare)

        expect(board).toHaveAttribute('aria-busy', 'true')
        expect(screen.getByRole('button', {name: 'Undo last move'})).toHaveAttribute(
            'aria-disabled',
            'true'
        )
        expect(screen.getByRole('status')).toHaveTextContent('Computer turn.')
        // The pending turn belongs to the grid, so cell names and states must not churn beneath it
        expect(screen.getByRole('button', {
            name: 'Row 1, column 2: empty, available',
        })).toHaveAttribute('aria-disabled', 'false')

        await user.keyboard('{Control>}z{/Control}')

        expect(screen.getByRole('status')).toHaveTextContent(
            'Wait for the computer to finish its turn.'
        )

        await waitFor(() => {
            expect(board).toHaveAttribute('aria-busy', 'false')
            expect(screen.getByRole('status')).toHaveTextContent(
                /Blue played row \d+, column \d+\./
            )
        })

        expect(firstSquare).toHaveFocus()
    })

    it('keeps mode and difficulty locked after the first move', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)
        const user = userEvent.setup()

        render(<GoGame />)

        const versus = screen.getByRole('combobox', {name: 'Versus:'})

        await user.selectOptions(versus, 'computer')

        const difficulty = screen.getByRole('combobox', {name: 'Difficulty:'})

        expect(versus).toBeEnabled()
        expect(difficulty).toBeEnabled()

        fireEvent.click(screen.getByRole('button', {
            name: 'Row 1, column 1: empty, available',
        }))

        expect(versus).toBeDisabled()
        expect(difficulty).toBeDisabled()

        await waitFor(() => expect(
            screen.getByRole('grid', {name: 'Square Off Pro game board'})
        ).toHaveAttribute('aria-busy', 'false'))

        expect(versus).toBeDisabled()
        expect(difficulty).toBeDisabled()
    })

    it('names every square an undo reverts when the computer replied', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)
        const user = userEvent.setup()

        render(<GoGame />)

        await user.selectOptions(screen.getByRole('combobox', {name: 'Versus:'}), 'computer')
        await user.click(screen.getByRole('button', {name: 'Row 2, column 2: empty, available'}))

        const board = screen.getByRole('grid', {name: 'Square Off Pro game board'})

        await waitFor(() => expect(board).toHaveAttribute('aria-busy', 'false'))

        const undoButton = screen.getByRole('button', {
            name: /^Undo Red @ \(2, 2\)\. Also undoes Blue at row \d+, column \d+$/,
        })

        expect(undoButton).toHaveTextContent('Undo Red @ (2, 2)')
        expect(undoButton).not.toHaveTextContent('Blue')

        await user.click(undoButton)

        expect(screen.getByRole('status')).toHaveTextContent(
            /^Undid Red at row 2, column 2 and Blue at row \d+, column \d+\.$/
        )
        expect(screen.getByRole('button', {name: 'Undo last move'})).toBeVisible()
        expect(screen.getByRole('button', {
            name: 'Row 2, column 2: empty, available',
        })).toBeVisible()
    })

    it('explains why an unavailable control did nothing', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)
        const user = userEvent.setup()

        render(<GoGame />)

        const updates = screen.getByRole('status')

        const unavailableUndoShortcut = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            ctrlKey: true,
            key: 'z',
        })

        fireEvent(window, unavailableUndoShortcut)

        expect(updates).toHaveTextContent('There is no move to undo.')
        expect(unavailableUndoShortcut.defaultPrevented).toBe(false)

        await user.click(screen.getByRole('button', {name: 'Undo last move'}))

        expect(updates).toHaveTextContent('There is no move to undo.')

        const resetButton = screen.getByRole('button', {name: 'Reset Board'})

        await user.click(resetButton)

        expect(resetButton).toHaveFocus()
        expect(updates).toHaveTextContent('The board is already empty.')

        await user.selectOptions(screen.getByRole('combobox', {name: 'Versus:'}), 'computer')

        fireEvent.click(screen.getByRole('button', {name: 'Row 1, column 1: empty, available'}))
        fireEvent.click(resetButton)

        expect(updates).toHaveTextContent('Wait for the computer to finish its turn.')

        await waitFor(() => expect(
            screen.getByRole('grid', {name: 'Square Off Pro game board'})
        ).toHaveAttribute('aria-busy', 'false'))
    })

    it('uses the committed undo state before layout effects can dispatch the shortcut', async () => {
        render(
            <GoGameContextProvider>
                <BoardNavigationProvider>
                    <GameAnnouncementProvider>
                        <ControlBox />
                        <UndoAfterMoveCommit />
                        <LiveGameStatus />
                    </GameAnnouncementProvider>
                </BoardNavigationProvider>
            </GoGameContextProvider>
        )

        await waitFor(() => expect(
            screen.getByRole('button', {name: 'Reset Board'})
        ).toHaveAttribute('aria-disabled', 'true'))

        expect(screen.getByRole('button', {name: 'Undo last move'})).toHaveAttribute(
            'aria-disabled',
            'true'
        )
    })

    it('retains control focus and announces undo and reset outcomes', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const firstMove = screen.getByRole('button', {
            name: 'Row 2, column 2: empty, available',
        })

        await user.click(firstMove)
        await user.keyboard('{ArrowRight}')

        const undoButton = screen.getByRole('button', {name: 'Undo Red @ (2, 2)'})

        await user.click(undoButton)

        expect(undoButton).toHaveFocus()
        expect(undoButton).not.toBeDisabled()
        expect(undoButton).toHaveAttribute('aria-disabled', 'true')
        expect(screen.getByRole('status')).toHaveTextContent(
            'Undid Red at row 2, column 2.'
        )
        expect(screen.getByRole('button', {
            name: 'Row 2, column 3: empty, available',
        })).toHaveAttribute('tabindex', '0')

        await user.click(screen.getByRole('button', {
            name: 'Row 3, column 3: empty, available',
        }))
        await user.keyboard('{ArrowRight}')

        const resetButton = screen.getByRole('button', {name: 'Reset Board'})

        await user.click(resetButton)

        expect(resetButton).toHaveFocus()
        expect(resetButton).not.toBeDisabled()
        expect(resetButton).toHaveAttribute('aria-disabled', 'true')
        expect(screen.getByRole('status')).toHaveTextContent(
            'Board reset. Red moves first.'
        )
        expect(screen.getByRole('button', {
            name: 'Row 1, column 1: empty, available',
        })).toHaveAttribute('tabindex', '0')
    })
})
