import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {FaEnvelope} from 'react-icons/fa'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import ContactDetail from 'JS/pages/contact/sections/ContactDetail'
import {trackContactLinkClicked} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    trackContactLinkClicked: vi.fn(),
}))

describe('ContactDetail analytics', () => {
    beforeEach(() => {
        vi.mocked(trackContactLinkClicked).mockReset()
    })

    it('tracks a closed contact method without changing the native link', () => {
        render(<ContactDetail item={{
            analyticsMethod: 'email',
            icon: FaEnvelope,
            link: 'mailto:kennen@example.test',
            text: 'kennen@example.test',
        }} />)

        const link = screen.getByRole('link', {name: 'kennen@example.test'})

        expect(link).toHaveAttribute('href', 'mailto:kennen@example.test')
        fireEvent.click(link)
        expect(trackContactLinkClicked).toHaveBeenCalledWith('email')
    })
})
