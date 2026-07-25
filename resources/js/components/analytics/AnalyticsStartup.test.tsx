import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router'
import {afterEach, describe, expect, it, vi} from 'vitest'
import AnalyticsConsent from 'Components/analytics/AnalyticsConsent'
import PageViewTracker from 'Components/analytics/PageViewTracker'
import {
    AnalyticsPreferencesProvider,
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'
import {resetAnalyticsEngineForTests} from 'JS/analytics'
import {ANALYTICS_PREFERENCE_KEY} from 'JS/analytics/engine'

const validConfiguration = {
    enabled: true,
    measurement_id: 'G-TEST1234',
}

const defaultConfiguration = {
    enabled: false,
    measurement_id: '',
}

type TPreferenceSnapshot = {
    isAvailable: boolean
    isOpen: boolean
    preference: 'denied' | 'granted' | null
}

const PreferenceSnapshot: React.FC<{
    snapshots: TPreferenceSnapshot[]
}> = ({snapshots}) => {
    const {
        isAvailable,
        isOpen,
        preference,
    } = useAnalyticsPreferences()

    snapshots.push({
        isAvailable,
        isOpen,
        preference,
    })

    return <AnalyticsConsent />
}

afterEach(() => {
    resetAnalyticsEngineForTests()
    window.APP_CONFIG.analytics = defaultConfiguration
    window.localStorage.clear()
    document.getElementById('kennen-ga4-script')?.remove()
    delete window.dataLayer
    delete window.gtag
    vi.restoreAllMocks()
})

describe('analytics startup', () => {
    it('places_the_first_visit_choice_in_keyboard_order_before_use', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration
        const snapshots: TPreferenceSnapshot[] = []

        render(
            <AnalyticsPreferencesProvider>
                <PreferenceSnapshot snapshots={snapshots} />
                <main tabIndex={-1}>
                    <a href="/games">Open games</a>
                </main>
            </AnalyticsPreferencesProvider>,
        )

        expect(snapshots[0]).toEqual({
            isAvailable: false,
            isOpen: false,
            preference: null,
        })
        expect(snapshots[snapshots.length - 1]).toEqual({
            isAvailable: true,
            isOpen: true,
            preference: null,
        })

        await user.tab()

        expect(screen.getByRole('button', {
            name: 'Allow analytics',
        })).toHaveFocus()
    })

    it.each(['granted', 'denied'] as const)(
        'keeps_a_stored_%s_out_of_the_unresolved_consent_ui',
        (preference) => {
            window.APP_CONFIG.analytics = validConfiguration
            window.localStorage.setItem(
                ANALYTICS_PREFERENCE_KEY,
                preference,
            )
            const snapshots: TPreferenceSnapshot[] = []

            render(
                <AnalyticsPreferencesProvider>
                    <PreferenceSnapshot snapshots={snapshots} />
                </AnalyticsPreferencesProvider>,
            )

            expect(snapshots[0]).toEqual({
                isAvailable: false,
                isOpen: false,
                preference: null,
            })
            expect(screen.queryByRole('button', {
                name: 'Allow analytics',
            })).not.toBeInTheDocument()
            expect(screen.queryByRole('button', {
                name: 'No thanks',
            })).not.toBeInTheDocument()
        },
    )

    it('does_not_emit_before_authoritative_preference_reconciliation', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(
            ANALYTICS_PREFERENCE_KEY,
            'granted',
        )
        const preferenceStorage = window.localStorage
        const gtag = vi.fn()
        window.gtag = gtag
        const localStorage = vi.spyOn(window, 'localStorage', 'get')
            .mockReturnValueOnce(preferenceStorage)
            .mockImplementation(() => {
                throw new Error('Storage unavailable')
            })

        try {
            render(
                <MemoryRouter initialEntries={['/']}>
                    <AnalyticsPreferencesProvider>
                        <PageViewTracker />
                    </AnalyticsPreferencesProvider>
                </MemoryRouter>,
            )

            expect(gtag).not.toHaveBeenCalled()
            expect(document.getElementById('kennen-ga4-script')).toBeNull()
        } finally {
            localStorage.mockRestore()
        }
    })
})
