import React from 'react'
import {createEvent, fireEvent, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import GoGame from 'Components/go/Go'

const getCell = (row: number, column: number, state = 'empty, available') => (
    screen.getByRole('button', {
        name: `Row ${row}, column ${column}: ${state}`,
    })
)

describe('Square Off Pro board accessibility', () => {
    it('exposes a named 10 by 10 grid with coordinates ownership and availability', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const board = screen.getByRole('grid', {name: 'Square Off Pro game board'})

        expect(board).toHaveAttribute('aria-rowcount', '10')
        expect(board).toHaveAttribute('aria-colcount', '10')
        expect(within(board).getAllByRole('row')).toHaveLength(10)
        expect(within(board).getAllByRole('gridcell')).toHaveLength(100)
        expect(getCell(1, 1)).toHaveAttribute('aria-disabled', 'false')

        await user.click(getCell(1, 1))

        const claimedCell = getCell(1, 1, 'Red, unavailable')

        expect(claimedCell).toHaveAttribute('aria-disabled', 'true')
        expect(within(claimedCell).getByText('R')).toBeVisible()
        const legend = screen.getByRole('list', {name: 'Square ownership legend'})

        expect(within(legend).getByText('Red').previousElementSibling).toHaveTextContent('R')
        expect(within(legend).getByText('Blue').previousElementSibling).toHaveTextContent('B')
        expect(screen.getByText('Next player: Blue')).toBeVisible()
        expect(screen.getByText(/Press Ctrl\+Z or Command\+Z to undo/)).toBeVisible()
        expect(screen.getByRole('status')).not.toHaveAccessibleName()
    })

    it('uses roving tab index and spatial keyboard navigation across every cell state', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const firstCell = getCell(1, 1)
        const secondCell = getCell(1, 2)

        expect(screen.getAllByRole('button').filter(button => button.tabIndex === 0)).toContain(firstCell)
        expect(within(screen.getByRole('grid')).getAllByRole('button').filter(
            button => button.tabIndex === 0
        )).toHaveLength(1)

        firstCell.focus()
        await user.keyboard('{Enter}{ArrowRight}')

        expect(secondCell).toHaveFocus()
        expect(getCell(1, 1, 'Red, unavailable')).toHaveAttribute('tabindex', '-1')
        expect(secondCell).toHaveAttribute('tabindex', '0')

        await user.tab()

        expect(screen.getByRole('grid').contains(document.activeElement)).toBe(false)

        await user.tab({shift: true})

        expect(secondCell).toHaveFocus()
    })

    it('stops at board edges and supports row and board boundary keys', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        getCell(1, 1).focus()
        await user.keyboard('{ArrowUp}{ArrowLeft}')
        expect(getCell(1, 1)).toHaveFocus()

        await user.keyboard('{End}')
        expect(getCell(1, 10)).toHaveFocus()

        await user.keyboard('{Home}')
        expect(getCell(1, 1)).toHaveFocus()

        await user.keyboard('{Control>}{End}{/Control}')
        expect(getCell(10, 10)).toHaveFocus()

        await user.keyboard('{ArrowDown}{ArrowRight}')
        expect(getCell(10, 10)).toHaveFocus()

        await user.keyboard('{Control>}{Home}{/Control}')
        expect(getCell(1, 1)).toHaveFocus()
    })

    it('leaves modified arrow keys to the browser and the platform', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const firstCell = getCell(1, 1)

        firstCell.focus()
        await user.keyboard('{Alt>}{ArrowRight}{/Alt}')
        expect(firstCell).toHaveFocus()

        await user.keyboard('{Meta>}{ArrowRight}{/Meta}')
        expect(firstCell).toHaveFocus()

        await user.keyboard('{Shift>}{ArrowDown}{/Shift}')
        expect(firstCell).toHaveFocus()

        // Alt+Arrow is browser history navigation, so the board must not consume it
        const historyBack = createEvent.keyDown(firstCell, {altKey: true, key: 'ArrowLeft'})

        fireEvent(firstCell, historyBack)
        expect(historyBack.defaultPrevented).toBe(false)

        const boardMove = createEvent.keyDown(firstCell, {key: 'ArrowRight'})

        fireEvent(firstCell, boardMove)
        expect(boardMove.defaultPrevented).toBe(true)
        expect(getCell(1, 2)).toHaveFocus()
    })

    it('activates an available cell once with Enter or Space and rejects unavailable activation', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const firstCell = getCell(1, 1)

        firstCell.focus()
        await user.keyboard('{Enter}')

        const claimedCell = getCell(1, 1, 'Red, unavailable')

        expect(claimedCell).toHaveFocus()
        expect(screen.getByText('Red Score:')).toBeVisible()
        expect(screen.getByText('Red Score:').parentElement).toHaveTextContent('Red Score: 1')

        await user.keyboard('{Enter}')

        expect(screen.getByRole('status')).toHaveTextContent(
            'Row 1, column 1 is already claimed by Red.'
        )
        expect(screen.getByText('Next player: Blue')).toBeVisible()

        getCell(1, 2).focus()
        await user.keyboard(' ')

        expect(getCell(1, 2, 'Blue, unavailable')).toHaveFocus()
        expect(screen.getByText('Blue Score:')).toBeVisible()
        expect(screen.getByText('Blue Score:').parentElement).toHaveTextContent('Blue Score: 1')
    })

    it('keeps focus on a cell when a capture changes its ownership', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        await user.click(getCell(1, 2))
        await user.click(getCell(1, 1))

        const capturedCell = getCell(1, 1, 'Blue, unavailable')

        capturedCell.focus()
        fireEvent.click(getCell(2, 1))

        expect(getCell(1, 1, 'Red, unavailable')).toHaveFocus()
        expect(getCell(1, 1, 'Red, unavailable')).toHaveAttribute('tabindex', '0')
    })

    it('announces captures and completion without making individual cells live regions', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        await user.click(getCell(1, 2))
        await user.click(getCell(1, 1))
        await user.click(getCell(2, 1))

        const updates = screen.getByRole('status')

        expect(updates).toHaveTextContent(
            'Red played row 2, column 1. Captured 1 square. Score: Red 3, Blue 0. Next player: Blue.'
        )
        expect(screen.getAllByRole('status')).toHaveLength(1)

        for (let row = 1; row <= 10; row += 1) {
            for (let column = 1; column <= 10; column += 1) {
                const cell = screen.queryByRole('button', {
                    name: `Row ${row}, column ${column}: empty, available`,
                })

                if (cell) {
                    await user.click(cell)
                }
            }
        }

        const result = screen.getByText(/^(Winner: (Red|Blue)|Tied game!)$/)

        expect(result).toBeVisible()
        expect(updates).toHaveTextContent(/played row \d+, column \d+\..*Score: Red \d+, Blue \d+\./)
        expect(updates).toHaveTextContent(`${result.textContent}.`)

        await user.click(screen.getByRole('button', {
            name: /Row 1, column 1: (Red|Blue), unavailable/,
        }))

        expect(updates).toHaveTextContent('The game is complete. Reset the board to play again.')
        const completedCellAnnouncement = updates.firstElementChild

        await user.click(screen.getByRole('button', {name: 'Undo last move'}))

        expect(updates.firstElementChild).not.toBe(completedCellAnnouncement)
        expect(updates).toHaveTextContent('The game is complete. Reset the board to play again.')
        expect(result).toBeVisible()
        expect(screen.getByRole('button', {name: 'Undo last move'})).toHaveAttribute(
            'aria-disabled',
            'true'
        )
        expect(screen.queryByRole('button', {
            name: /empty, available$/,
        })).not.toBeInTheDocument()
    }, 15000)

    it('announces when the opponent immediately captures the played square', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        await user.click(getCell(1, 2))
        await user.click(getCell(10, 10))
        await user.click(getCell(2, 1))
        await user.click(getCell(10, 9))
        await user.click(getCell(2, 3))
        await user.click(getCell(10, 8))
        await user.click(getCell(3, 2))
        await user.click(getCell(2, 2))

        expect(getCell(2, 2, 'Red, unavailable')).toBeVisible()
        expect(screen.getByRole('status')).toHaveTextContent(
            'Blue played row 2, column 2. Red captured the played square.'
        )
    })
})
