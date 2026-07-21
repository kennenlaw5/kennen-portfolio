import React, {Suspense} from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import Games from 'JS/pages/Games'

describe('Engineering Lab', () => {
    it('frames the playable projects as engineering experiments', () => {
        render(
            <Suspense fallback={<div>Loading experiment</div>}>
                <Games />
            </Suspense>
        )

        expect(screen.getByRole('heading', {name: 'Engineering Lab'})).toBeVisible()
        expect(screen.getByText('Interactive systems, explained')).toBeVisible()
        expect(screen.getByRole('button', {name: 'Open Tic Tac Toe experiment'})).toBeVisible()
        expect(screen.getByRole('button', {name: 'Open Square Off Pro experiment'})).toBeVisible()
        expect(screen.getByRole('heading', {name: 'Tic Tac Toe', level: 3})).toBeVisible()
        expect(screen.getByRole('heading', {name: 'Square Off Pro', level: 3})).toBeVisible()
        expect(screen.getByRole('list', {name: 'Tic Tac Toe engineering concepts'})).toBeVisible()
        expect(screen.getByRole('list', {name: 'Square Off Pro engineering concepts'})).toBeVisible()
        expect(screen.getByText('Reducer + Context')).toBeVisible()
        expect(screen.getByText('Heuristic AI')).toBeVisible()
    })

    it('describes Square Off Pro without requiring prior context', () => {
        render(
            <Suspense fallback={<div>Loading experiment</div>}>
                <Games />
            </Suspense>
        )

        expect(screen.getByText(/Square Off Pro is a turn-based territory game played on a 10×10 board/)).toBeVisible()
        expect(screen.queryByText(/pushes the same architecture further/)).not.toBeInTheDocument()
        expect(screen.queryByText(/state model deterministic/)).not.toBeInTheDocument()
    })

    it('keeps the engineering context visible when an experiment is opened', async () => {
        const user = userEvent.setup()

        render(
            <Suspense fallback={<div>Loading experiment</div>}>
                <Games />
            </Suspense>
        )

        await user.click(screen.getByRole('button', {name: 'Open Tic Tac Toe experiment'}))

        expect(await screen.findByRole('heading', {name: 'Tic Tac Toe'})).toBeVisible()
        expect(screen.getByText('Engineering Lab experiment')).toBeVisible()
        expect(screen.getByRole('button', {name: 'Back to experiments'})).toBeVisible()
        expect(screen.getByRole('list', {name: 'Tic Tac Toe engineering concepts'})).toBeVisible()
    })

    it('places the Square Off Pro rules before the game controls', async () => {
        const user = userEvent.setup()

        render(
            <Suspense fallback={<div>Loading experiment</div>}>
                <Games />
            </Suspense>
        )

        await user.click(screen.getByRole('button', {name: 'Open Square Off Pro experiment'}))

        const rulesSummary = await screen.findByText('How to play', {selector: 'span'})
        const versusSelect = screen.getByRole('combobox', {name: 'Versus:'})

        expect(rulesSummary.compareDocumentPosition(versusSelect) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
})
