import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, Route, Routes} from 'react-router-dom'
import {afterEach, describe, expect, it, vi} from 'vitest'
import AnalyticsConsent from 'Components/analytics/AnalyticsConsent'
import {
    AnalyticsPreferencesProvider,
} from 'Components/analytics/AnalyticsPreferencesContext'
import Footer from 'Components/layout/Footer'
import Layout from 'Components/layout/Layout'
import {
    resetAnalyticsEngineForTests,
    trackPageView,
} from 'JS/analytics'
import {ANALYTICS_PREFERENCE_KEY} from 'JS/analytics/engine'

vi.mock('Components/analytics/PageViewTracker', () => ({
    default: () => null,
}))

const validConfiguration = {
    enabled: true,
    measurement_id: 'G-TEST1234',
}

const defaultConfiguration = {
    enabled: false,
    measurement_id: '',
}

const renderPreferences = () => render(
    <AnalyticsPreferencesProvider>
        <AnalyticsConsent />
        <main tabIndex={-1}>
            <a href="/games">Open games</a>
        </main>
        <Footer />
    </AnalyticsPreferencesProvider>,
)

const setPrivacySignal = (
    property: 'doNotTrack' | 'globalPrivacyControl',
    value: string | boolean | null | undefined,
) => {
    Object.defineProperty(navigator, property, {
        configurable: true,
        value,
    })
}

afterEach(() => {
    resetAnalyticsEngineForTests()
    window.APP_CONFIG.analytics = defaultConfiguration
    window.localStorage.clear()
    setPrivacySignal('doNotTrack', null)
    setPrivacySignal('globalPrivacyControl', false)
    document.getElementById('kennen-ga4-script')?.remove()
    delete window.dataLayer
    delete window.gtag
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe('analytics preferences', () => {
    it('analytics_preferences_are_accessible_and_non_blocking', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration

        renderPreferences()

        const region = screen.getByRole('region', {
            name: 'Analytics preferences',
        })
        const allowButton = screen.getByRole('button', {
            name: 'Allow analytics',
        })
        const denyButton = screen.getByRole('button', {name: 'No thanks'})
        const pageLink = screen.getByRole('link', {name: 'Open games'})

        expect(region).toHaveTextContent('Google Analytics')
        expect(region).toHaveTextContent(/directional/i)
        expect(region).not.toHaveClass('fixed')
        expect(allowButton.className).toBe(denyButton.className)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.queryByRole('button', {name: 'Close'}))
            .not.toBeInTheDocument()
        expect(pageLink).toHaveAttribute('href', '/games')
        expect(pageLink).not.toHaveAttribute('aria-hidden')

        await user.tab()
        expect(allowButton).toHaveFocus()
        await user.tab()
        expect(denyButton).toHaveFocus()
        await user.tab()
        expect(pageLink).toHaveFocus()

        await user.click(denyButton)
        expect(screen.getByRole('main')).toHaveFocus()
    })

    it('first_time_preferences_do_not_offer_a_reopen_control', () => {
        window.APP_CONFIG.analytics = validConfiguration

        renderPreferences()

        expect(screen.queryByRole('button', {
            name: 'Analytics preferences',
        })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', {name: 'Close'}))
            .not.toBeInTheDocument()
        expect(screen.getByRole('region', {
            name: 'Analytics preferences',
        })).toBeInTheDocument()
    })
    it('the_layout_provides_the_initial_choice_focus_target', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration

        render(
            <MemoryRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<p>Page content</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        )

        const main = screen.getByRole('main')

        expect(main).toHaveAttribute('tabindex', '-1')

        await user.click(screen.getByRole('button', {name: 'No thanks'}))

        expect(main).toHaveFocus()
    })

    it.each([
        ['Do Not Track', 'doNotTrack', '1'],
        ['Global Privacy Control', 'globalPrivacyControl', true],
    ] as const)(
        'privacy_signal_override_is_focusable_and_explained: %s',
        async (_label, property, value) => {
            const user = userEvent.setup()
            window.APP_CONFIG.analytics = validConfiguration
            window.localStorage.setItem(
                ANALYTICS_PREFERENCE_KEY,
                'granted',
            )
            setPrivacySignal(property, value)

            renderPreferences()
            await user.click(screen.getByRole('button', {
                name: 'Analytics preferences',
            }))

            const allowButton = screen.getByRole('button', {
                name: 'Allow analytics',
            })
            const descriptionId = allowButton.getAttribute('aria-describedby')

            expect(allowButton).toHaveAttribute('aria-disabled', 'true')
            expect(allowButton).not.toBeDisabled()
            expect(descriptionId).not.toBeNull()
            expect(document.getElementById(descriptionId as string))
                .toHaveTextContent(
                    /browser privacy signal keeps analytics disabled/i,
                )

            allowButton.focus()
            expect(allowButton).toHaveFocus()
            await user.click(allowButton)

            expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY))
                .toBe('granted')
            expect(document.getElementById('kennen-ga4-script')).toBeNull()
        },
    )

    it('analytics_preferences_are_reopenable_and_revocable', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')
        const gtag = vi.fn()
        window.gtag = gtag

        renderPreferences()
        gtag.mockClear()

        expect(screen.queryByRole('region', {
            name: 'Analytics preferences',
        })).not.toBeInTheDocument()

        const reopenButton = screen.getByRole('button', {
            name: 'Analytics preferences',
        })
        await user.click(reopenButton)
        expect(screen.getByRole('heading', {
            name: 'Analytics preferences',
        })).toHaveFocus()
        expect(screen.getByText(
            /selecting no thanks turns off analytics/i,
        )).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'No thanks'}))

        expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY))
            .toBe('denied')
        expect(gtag).toHaveBeenCalledWith(
            'consent',
            'update',
            expect.objectContaining({analytics_storage: 'denied'}),
        )
        expect(screen.queryByRole('region', {
            name: 'Analytics preferences',
        })).not.toBeInTheDocument()
        expect(reopenButton).toHaveFocus()

        gtag.mockClear()
        await user.click(reopenButton)
        expect(screen.getByRole('heading', {
            name: 'Analytics preferences',
        })).toHaveFocus()
        await user.click(screen.getByRole('button', {
            name: 'Allow analytics',
        }))

        expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY))
            .toBe('granted')
        expect(gtag).toHaveBeenCalledWith(
            'consent',
            'update',
            expect.objectContaining({analytics_storage: 'granted'}),
        )
    })

    it('shares one configured engine with application event callers', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')
        const gtag = vi.fn()
        window.gtag = gtag

        renderPreferences()
        trackPageView('/')

        expect(gtag.mock.calls.filter((
            [command, _measurementId, parameters],
        ) => (
            command === 'config'
            && !(parameters as {update?: boolean}).update
        ))).toHaveLength(1)
        expect(gtag).toHaveBeenCalledWith(
            'event',
            'page_view',
            {page_path: '/'},
        )
    })

    it('reopened_preferences_can_close_without_changing_the_saved_choice', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        renderPreferences()

        const reopenButton = screen.getByRole('button', {
            name: 'Analytics preferences',
        })
        await user.click(reopenButton)

        await user.click(screen.getByRole('button', {name: 'Close'}))

        expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY))
            .toBe('granted')
        expect(screen.queryByRole('region', {
            name: 'Analytics preferences',
        })).not.toBeInTheDocument()
        expect(reopenButton).toHaveFocus()
    })

    it.each([
        ['granted', 'No thanks', /try No thanks again/i],
        ['denied', 'Allow analytics', /try Allow analytics again/i],
    ] as const)(
        'keeps_preferences_open_when_browser_storage_rejects_the_choice: %s to %s',
        async (storedPreference, action, expectedMessage) => {
            const user = userEvent.setup()
            window.APP_CONFIG.analytics = validConfiguration
            window.localStorage.setItem(
                ANALYTICS_PREFERENCE_KEY,
                storedPreference,
            )

            renderPreferences()
            await user.click(screen.getByRole('button', {
                name: 'Analytics preferences',
            }))

            const setItem = vi.spyOn(Storage.prototype, 'setItem')
                .mockImplementation(() => {
                    throw new Error('Storage is unavailable')
                })

            await user.click(screen.getByRole('button', {name: action}))

            expect(screen.getByRole('region', {
                name: 'Analytics preferences',
            })).toBeInTheDocument()
            expect(screen.getByRole('status')).toHaveTextContent(
                /could not save your choice/i,
            )
            expect(screen.getByRole('status'))
                .toHaveTextContent(expectedMessage)
            expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY))
                .toBe(storedPreference)

            setItem.mockRestore()
        },
    )

    it('keeps events off for the page when denial cannot be stored', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')
        const gtag = vi.fn()
        window.gtag = gtag

        renderPreferences()
        await user.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))
        const setItem = vi.spyOn(Storage.prototype, 'setItem')
            .mockImplementation(() => {
                throw new Error('Storage is unavailable')
            })

        await user.click(screen.getByRole('button', {name: 'No thanks'}))
        gtag.mockClear()
        trackPageView('/')

        expect(gtag).not.toHaveBeenCalled()

        setItem.mockRestore()
    })

    it('disabled_analytics_configuration_is_visually_and_network_inert', () => {
        const fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        for (const configuration of [
            defaultConfiguration,
            {enabled: true, measurement_id: 'UA-INVALID'},
        ]) {
            window.APP_CONFIG.analytics = configuration
            const {unmount} = renderPreferences()

            expect(screen.queryByRole('region', {
                name: 'Analytics preferences',
            })).not.toBeInTheDocument()
            expect(screen.queryByRole('button', {
                name: 'Analytics preferences',
            })).not.toBeInTheDocument()
            expect(document.getElementById('kennen-ga4-script')).toBeNull()
            expect(window.dataLayer).toBeUndefined()

            unmount()
        }

        expect(fetchMock).not.toHaveBeenCalled()

        window.APP_CONFIG.analytics = validConfiguration
        renderPreferences()

        expect(screen.getByRole('button', {
            name: 'Analytics preferences',
        })).toBeInTheDocument()
    })
})
