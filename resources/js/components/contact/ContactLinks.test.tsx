import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import Email from 'Components/contact/Email'
import Linkedin from 'Components/contact/Linkedin'
import {trackContactLinkClicked} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    trackContactLinkClicked: vi.fn(),
}))

describe('footer contact analytics', () => {
    beforeEach(() => {
        vi.mocked(trackContactLinkClicked).mockReset()
    })

    it('uses closed contact methods for email and LinkedIn', () => {
        render(
            <>
                <Email />
                <Linkedin />
            </>
        )

        const emailLink = screen.getByRole('link', {
            name: 'Email Kennen Lawrence',
        })
        const linkedinLink = screen.getByRole('link', {
            name: 'Kennen Lawrence on LinkedIn',
        })

        emailLink.addEventListener('click', (event) => event.preventDefault())
        linkedinLink.addEventListener('click', (event) => event.preventDefault())
        fireEvent.click(emailLink)
        fireEvent.click(linkedinLink)

        expect(vi.mocked(trackContactLinkClicked).mock.calls).toEqual([
            ['email'],
            ['linkedin'],
        ])
    })
})
