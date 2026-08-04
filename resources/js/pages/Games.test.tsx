import React, {Suspense} from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {MemoryRouter, Outlet, Route, Routes} from 'react-router'
import Header from 'Components/layout/Header'
import Games from 'JS/pages/Games'

const renderGames = () => render(
    <MemoryRouter initialEntries={['/games']}>
        <Routes>
            <Route
                path="games"
                element={(
                    <Suspense fallback={<div>Loading experiment</div>}>
                        <Games />
                    </Suspense>
                )}
            />
        </Routes>
    </MemoryRouter>
)

const renderGamesWithNavigation = () => render(
    <MemoryRouter initialEntries={['/games']}>
        <Routes>
            <Route element={(
                <>
                    <Header />
                    <Outlet />
                </>
            )}>
                <Route
                    path="games"
                    element={(
                        <Suspense fallback={<div>Loading experiment</div>}>
                            <Games />
                        </Suspense>
                    )}
                />
            </Route>
        </Routes>
    </MemoryRouter>
)

describe('Engineering Lab', () => {
    it('frames the playable projects as engineering experiments', () => {
        renderGames()

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
        renderGames()

        expect(screen.getByText(/Square Off Pro is a turn-based territory game played on a 10×10 board/)).toBeVisible()
        expect(screen.queryByText(/pushes the same architecture further/)).not.toBeInTheDocument()
        expect(screen.queryByText(/state model deterministic/)).not.toBeInTheDocument()
    })

    it('keeps the engineering context visible when an experiment is opened', async () => {
        const user = userEvent.setup()

        renderGames()

        await user.click(screen.getByRole('button', {name: 'Open Tic Tac Toe experiment'}))

        expect(await screen.findByRole('heading', {name: 'Tic Tac Toe'})).toBeVisible()
        expect(screen.getByText('Engineering Lab experiment')).toBeVisible()
        expect(screen.getByRole('button', {name: 'Back to experiments'})).toBeVisible()
        expect(screen.getByRole('list', {name: 'Tic Tac Toe engineering concepts'})).toBeVisible()
    })

    it('places the Square Off Pro rules before the game controls', async () => {
        const user = userEvent.setup()

        renderGames()

        await user.click(screen.getByRole('button', {name: 'Open Square Off Pro experiment'}))

        const rulesSummary = await screen.findByText('How to play', {selector: 'span'})
        const versusSelect = screen.getByRole('combobox', {name: 'Versus:'})

        expect(rulesSummary.compareDocumentPosition(versusSelect) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('establishes Square Off focus without changing Tic Tac Toe focus', async () => {
        const user = userEvent.setup()

        renderGames()

        const openButton = screen.getByRole('button', {name: 'Open Square Off Pro experiment'})

        await user.click(openButton)

        expect(await screen.findByRole('heading', {name: 'Square Off Pro', level: 2})).toHaveFocus()

        await user.click(screen.getByRole('button', {name: 'Back to experiments'}))

        expect(screen.getByRole('button', {name: 'Open Square Off Pro experiment'})).toHaveFocus()

        await user.click(screen.getByRole('button', {name: 'Open Tic Tac Toe experiment'}))

        const heading = await screen.findByRole('heading', {
            name: 'Tic Tac Toe',
            level: 2,
        })

        expect(heading).not.toHaveFocus()

        await user.click(screen.getByRole('button', {name: 'Back to experiments'}))

        expect(screen.getByRole('button', {
            name: 'Open Tic Tac Toe experiment',
        })).not.toHaveFocus()
    })

    it('returns to the experiment list from the desktop Engineering Lab navigation', async () => {
        const user = userEvent.setup()

        renderGamesWithNavigation()

        await user.click(screen.getByRole('button', {name: 'Open Tic Tac Toe experiment'}))
        expect(await screen.findByRole('heading', {name: 'Tic Tac Toe', level: 2})).toBeVisible()

        const desktopNavigation = screen.getAllByRole('navigation')[0]
        await user.click(within(desktopNavigation).getByRole('link', {name: 'Engineering Lab'}))

        expect(screen.getByRole('heading', {name: 'Engineering Lab', level: 2})).toBeVisible()
    })

    it('returns to the experiment list through the mobile hamburger navigation', async () => {
        const user = userEvent.setup()

        renderGamesWithNavigation()

        await user.click(screen.getByRole('button', {name: 'Open Square Off Pro experiment'}))
        expect(await screen.findByRole('heading', {name: 'Square Off Pro', level: 2})).toBeVisible()

        await user.click(screen.getByRole('button', {name: 'Toggle navigation'}))
        const mobileNavigation = screen.getAllByRole('navigation')[1]
        await user.click(within(mobileNavigation).getByRole('link', {name: 'Engineering Lab'}))

        expect(screen.getByRole('heading', {name: 'Engineering Lab', level: 2})).toBeVisible()
    })
})
