import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import Project from 'Components/Project'
import {trackProjectLinkClicked} from 'JS/analytics'
import {PROJECT_ANALYTICS_IDS} from 'JS/analytics/contracts'

vi.mock('JS/analytics', () => ({
    trackProjectLinkClicked: vi.fn(),
}))

describe('Project analytics', () => {
    beforeEach(() => {
        vi.mocked(trackProjectLinkClicked).mockReset()
    })

    it('tracks a stable project id without changing the native link', () => {
        render(<Project project={{
            analyticsId: PROJECT_ANALYTICS_IDS.AMAZON_AUTOS,
            description: 'Vehicle marketplace integration',
            link: 'https://example.test/project',
            technologies: [],
            title: 'Visible Project Title',
        }} />)

        const link = screen.getByRole('link', {name: 'Visible Project Title'})

        expect(link).toHaveAttribute('href', 'https://example.test/project')
        fireEvent.click(link)
        expect(trackProjectLinkClicked).toHaveBeenCalledWith(
            PROJECT_ANALYTICS_IDS.AMAZON_AUTOS,
        )
    })
})
