import React, {useState} from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {MemoryRouter, useNavigate} from 'react-router-dom'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import PageViewTracker from 'Components/analytics/PageViewTracker'
import {trackPageView} from 'JS/analytics'

const analyticsPreferences = vi.hoisted(() => ({
    isAvailable: true,
    preference: 'granted' as 'denied' | 'granted' | null,
    privacySignalActive: false,
}))

vi.mock('JS/analytics', () => ({
    trackPageView: vi.fn(),
}))

vi.mock('Components/analytics/AnalyticsPreferencesContext', () => ({
    useAnalyticsPreferences: () => analyticsPreferences,
}))

const PageViewHarness: React.FC = () => {
    const navigate = useNavigate()
    const [, setRenderCount] = useState(0)

    return (
        <>
            <PageViewTracker />
            <button onClick={() => navigate('/experience')}>
                Experience
            </button>
            <button onClick={() => setRenderCount((count) => count + 1)}>
                Rerender
            </button>
            <button onClick={() => {
                analyticsPreferences.preference = 'granted'
                setRenderCount((count) => count + 1)
            }}>
                Grant analytics
            </button>
            <button onClick={() => {
                analyticsPreferences.preference = 'denied'
                setRenderCount((count) => count + 1)
            }}>
                Deny analytics
            </button>
        </>
    )
}

describe('PageViewTracker', () => {
    beforeEach(() => {
        analyticsPreferences.isAvailable = true
        analyticsPreferences.preference = 'granted'
        analyticsPreferences.privacySignalActive = false
        vi.mocked(trackPageView).mockReset()
    })

    it('page_view_tracker_emits_once_per_path', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <PageViewHarness />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(trackPageView).toHaveBeenCalledTimes(1)
        })
        expect(trackPageView).toHaveBeenLastCalledWith('/')

        fireEvent.click(screen.getByRole('button', {name: 'Experience'}))

        await waitFor(() => {
            expect(trackPageView).toHaveBeenCalledTimes(2)
        })
        expect(trackPageView).toHaveBeenLastCalledWith('/experience')

        fireEvent.click(screen.getByRole('button', {name: 'Rerender'}))
        expect(trackPageView).toHaveBeenCalledTimes(2)
    })

    it('emits the current path when permission is granted after mount', async () => {
        analyticsPreferences.preference = null

        render(
            <MemoryRouter initialEntries={['/experience']}>
                <PageViewHarness />
            </MemoryRouter>
        )

        expect(trackPageView).not.toHaveBeenCalled()

        fireEvent.click(screen.getByRole('button', {
            name: 'Grant analytics',
        }))

        await waitFor(() => {
            expect(trackPageView).toHaveBeenCalledTimes(1)
        })
        expect(trackPageView).toHaveBeenLastCalledWith('/experience')

        fireEvent.click(screen.getByRole('button', {name: 'Rerender'}))
        expect(trackPageView).toHaveBeenCalledTimes(1)
    })

    it('does not duplicate a path after revocation and regrant', async () => {
        render(
            <MemoryRouter initialEntries={['/experience']}>
                <PageViewHarness />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(trackPageView).toHaveBeenCalledTimes(1)
        })

        fireEvent.click(screen.getByRole('button', {
            name: 'Deny analytics',
        }))
        fireEvent.click(screen.getByRole('button', {
            name: 'Grant analytics',
        }))

        expect(trackPageView).toHaveBeenCalledTimes(1)
    })
})
