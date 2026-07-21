import React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import SquareOffRules from 'Components/go/SquareOffRules'

describe('Square Off Pro rules', () => {
    it('keeps an accurate, player-facing rules reference behind a native disclosure', async () => {
        const user = userEvent.setup()

        render(<SquareOffRules />)

        const summaryLabel = screen.getByText('How to play', {selector: 'span'})
        const disclosure = summaryLabel.closest('details')

        expect(disclosure).not.toHaveAttribute('open')

        await user.click(summaryLabel.closest('summary') as HTMLElement)

        expect(disclosure).toHaveAttribute('open')

        const rules = screen.getByRole('region', {name: 'Square Off Pro rules'})

        expect(rules).toBeVisible()
        expect(within(rules).getByText(/Red goes first/)).toBeVisible()
        expect(within(rules).getByText(/above, below, left, and right/)).toBeVisible()
        expect(within(rules).getByText(/Diagonals never count/)).toBeVisible()
        expect(within(rules).getByText(/four matching neighbors/i)).toBeVisible()
        expect(within(rules).getByText(/three matching neighbors/i)).toBeVisible()
        expect(within(rules).getByText(/two matching neighbors/i)).toBeVisible()
        expect(within(rules).getByText(/captures from your move resolve first/i)).toBeVisible()
        expect(within(rules).getByText(/new square stays yours/i)).toBeVisible()
        expect(within(rules).getByText(/one point/)).toBeVisible()
        expect(within(rules).getByText(/same rules in Person and Computer modes/)).toBeVisible()
        expect(within(rules).getByText(/Before the board is full/)).toBeVisible()
        expect(within(rules).getByText(/Ctrl\+Z/)).toBeVisible()
        expect(within(rules).getByText(/Reset/)).toBeVisible()
    })
})
