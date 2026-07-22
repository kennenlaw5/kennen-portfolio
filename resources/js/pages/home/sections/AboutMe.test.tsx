import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import AboutMe from 'JS/pages/home/sections/AboutMe'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    ANALYTICS_EVENTS: {RESUME_DOWNLOAD: 'resume_download'},
    trackEvent: vi.fn(),
}))

describe('AboutMe resume download', () => {
    it('uses the native resume download endpoint', () => {
        render(<AboutMe />)

        const link = screen.getByRole('link', {name: 'Download My Resume'})

        expect(link).toHaveAttribute('href', '/resume/download')
        expect(link).not.toHaveAttribute('download')
        expect(link).not.toHaveAttribute('target')

        link.addEventListener('click', event => event.preventDefault())
        fireEvent.click(link)
        expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.RESUME_DOWNLOAD)
    })
})
