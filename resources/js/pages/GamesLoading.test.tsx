import React, {Suspense} from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import Games from 'JS/pages/Games'

vi.mock('Components/go/Go', () => new Promise(() => {}))
vi.mock('Components/TicTacToe/TicTacToe', () => new Promise(() => {}))

describe('Engineering Lab loading state', () => {
    it('scopes local loading context to Square Off without changing Tic Tac Toe loading', async () => {
        const user = userEvent.setup()

        const {unmount} = render(
            <Suspense fallback={<div role="alert">Loading the route</div>}>
                <Games />
            </Suspense>
        )

        await user.click(screen.getByRole('button', {name: 'Open Square Off Pro experiment'}))

        const status = await screen.findByRole('status')

        expect(status.querySelector('svg')).toHaveClass('animate-spin')
        expect(status).not.toHaveAttribute('aria-label')
        expect(status).toHaveTextContent('Loading Square Off Pro experiment')
        expect(screen.getByText('Loading Square Off Pro experiment')).toHaveClass('sr-only')
        expect(screen.getByRole('heading', {
            name: 'Square Off Pro',
            level: 2,
        })).toHaveFocus()
        expect(screen.getByRole('button', {name: 'Back to experiments'})).toBeVisible()
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()

        unmount()

        render(
            <Suspense fallback={<div role="alert">Loading the route</div>}>
                <Games />
            </Suspense>
        )

        await user.click(screen.getByRole('button', {
            name: 'Open Tic Tac Toe experiment',
        }))

        expect(await screen.findByRole('alert')).toHaveTextContent('Loading the route')
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
})
