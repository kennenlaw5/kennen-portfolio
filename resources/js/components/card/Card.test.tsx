import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import Card from 'Components/card/Card'

describe('Card', () => {
    it('exposes a keyboard-accessible disclosure control', async () => {
        const user = userEvent.setup()

        render(
            <Card header="Experience" isDropDown>
                <p>Experience details</p>
            </Card>
        )

        const toggle = screen.getByRole('button', {name: 'Experience'})
        const contentId = toggle.getAttribute('aria-controls')
        const content = document.getElementById(contentId || '')

        expect(toggle).toHaveAttribute('aria-expanded', 'false')
        expect(toggle.querySelector('div')).not.toBeInTheDocument()
        expect(toggle.querySelector('h1, h2, h3, h4, h5, h6')).not.toBeInTheDocument()
        expect(content).toHaveAttribute('aria-hidden', 'true')

        await user.click(toggle)

        expect(toggle).toHaveAttribute('aria-expanded', 'true')
        expect(content).toHaveAttribute('aria-hidden', 'false')

        toggle.focus()
        await user.keyboard('{Enter}')

        expect(toggle).toHaveAttribute('aria-expanded', 'false')
        expect(content).toHaveAttribute('aria-hidden', 'true')
    })

    it('does not render a button for a static card', () => {
        render(
            <Card header="Static card">
                <p>Static content</p>
            </Card>
        )

        expect(screen.queryByRole('button', {name: 'Static card'})).not.toBeInTheDocument()
        expect(screen.getByRole('heading', {name: 'Static card'})).toBeVisible()
        expect(screen.getByText('Static content')).toBeVisible()
    })
})
