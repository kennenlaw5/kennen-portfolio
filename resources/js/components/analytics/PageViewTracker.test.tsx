import React from 'react'
import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {describe, expect, it, vi} from 'vitest'
import PageViewTracker from 'Components/analytics/PageViewTracker'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    ANALYTICS_EVENTS: {PAGE_VIEW: 'page_view'},
    trackEvent: vi.fn(),
}))

describe('PageViewTracker', () => {
    it('tracks the active route', async () => {
        render(
            <MemoryRouter initialEntries={['/experience']}>
                <PageViewTracker />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.PAGE_VIEW)
        })
    })
})
