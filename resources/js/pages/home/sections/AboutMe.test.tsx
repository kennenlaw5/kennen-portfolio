import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import AboutMe from 'JS/pages/home/sections/AboutMe'
import {trackResumeDownloadClicked} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    trackResumeDownloadClicked: vi.fn(),
}))

describe('AboutMe resume download', () => {
    beforeEach(() => {
        vi.mocked(trackResumeDownloadClicked).mockReset()
    })

    it('resume_links_queue_click_intent_without_blocking_navigation', () => {
        render(<AboutMe />)

        const link = screen.getByRole('link', {name: 'Download My Resume'})

        expect(link).toHaveAttribute('href', '/resume/download')
        expect(link).not.toHaveAttribute('download')
        expect(link).not.toHaveAttribute('target')

        link.addEventListener('click', event => event.preventDefault())
        fireEvent.click(link)
        expect(trackResumeDownloadClicked).toHaveBeenCalledWith('home')
    })
})
