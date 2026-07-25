import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, Route, Routes} from 'react-router'
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

const dispatchStorageChange = ({
    key,
    newValue,
    oldValue,
    storageArea = window.localStorage,
}: {
    key: string | null
    newValue: string | null
    oldValue: string | null
    storageArea?: Storage
}): void => {
    fireEvent(window, new StorageEvent('storage', {
        key,
        newValue,
        oldValue,
        storageArea,
        url: window.location.href,
    }))
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

    it('cross_tab_denial_updates_preferences_and_suppresses_events', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration
        const gtag = vi.fn()
        window.gtag = gtag

        renderPreferences()
        await user.click(screen.getByRole('button', {
            name: 'Allow analytics',
        }))
        gtag.mockClear()

        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: 'denied',
            oldValue: 'granted',
        })

        expect(gtag).toHaveBeenCalledWith(
            'consent',
            'update',
            expect.objectContaining({analytics_storage: 'denied'}),
        )

        await user.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        expect(screen.queryByText(
            /selecting no thanks turns off analytics/i,
        )).not.toBeInTheDocument()

        gtag.mockClear()
        trackPageView('/')

        expect(gtag).not.toHaveBeenCalled()
    })

    it.each([
        ['preference removal', ANALYTICS_PREFERENCE_KEY],
        ['storage clear', null],
    ] as const)(
        'cross_tab_%s_reopens_the_initial_choice',
        (_description, key) => {
            window.APP_CONFIG.analytics = validConfiguration
            window.localStorage.setItem(
                ANALYTICS_PREFERENCE_KEY,
                'granted',
            )
            const gtag = vi.fn()
            window.gtag = gtag

            renderPreferences()
            gtag.mockClear()

            window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
            dispatchStorageChange({
                key,
                newValue: null,
                oldValue: key === null ? null : 'granted',
            })

            expect(screen.getByRole('region', {
                name: 'Analytics preferences',
            })).toBeInTheDocument()
            expect(screen.queryByRole('button', {
                name: 'Analytics preferences',
            })).not.toBeInTheDocument()
            expect(screen.queryByRole('button', {name: 'Close'}))
                .not.toBeInTheDocument()
            expect(gtag).toHaveBeenCalledWith(
                'consent',
                'update',
                expect.objectContaining({analytics_storage: 'denied'}),
            )

            gtag.mockClear()
            trackPageView('/')

            expect(gtag).not.toHaveBeenCalled()
        },
    )

    it('cross_tab_grant_closes_the_initial_choice_and_initializes', () => {
        window.APP_CONFIG.analytics = validConfiguration
        const gtag = vi.fn()
        window.gtag = gtag

        renderPreferences()

        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: 'granted',
            oldValue: null,
        })

        expect(screen.queryByRole('region', {
            name: 'Analytics preferences',
        })).not.toBeInTheDocument()
        expect(screen.getByRole('button', {
            name: 'Analytics preferences',
        })).toBeInTheDocument()
        expect(gtag).toHaveBeenCalledWith(
            'consent',
            'update',
            expect.objectContaining({analytics_storage: 'granted'}),
        )
    })

    it('uses_the_current_stored_denial_instead_of_a_stale_grant_event', async () => {
        const user = userEvent.setup()
        window.APP_CONFIG.analytics = validConfiguration
        const gtag = vi.fn()
        window.gtag = gtag

        renderPreferences()
        await user.click(screen.getByRole('button', {
            name: 'Allow analytics',
        }))
        await user.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))
        await user.click(screen.getByRole('button', {name: 'No thanks'}))
        gtag.mockClear()

        expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY))
            .toBe('denied')

        const getItem = vi.spyOn(Storage.prototype, 'getItem')

        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: 'granted',
            oldValue: null,
        })
        expect(getItem).toHaveBeenCalledOnce()
        expect(getItem).toHaveBeenCalledWith(ANALYTICS_PREFERENCE_KEY)
        getItem.mockRestore()

        trackPageView('/')

        expect(gtag).not.toHaveBeenCalled()

        await user.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))
        expect(screen.queryByText(
            /selecting no thanks turns off analytics/i,
        )).not.toBeInTheDocument()
    })

    it.each([
        ['denial event', ANALYTICS_PREFERENCE_KEY, 'denied'],
        ['clear event', null, null],
    ] as const)(
        'uses_a_newer_stored_grant_instead_of_a_stale_%s',
        async (_description, key, newValue) => {
            const user = userEvent.setup()
            window.APP_CONFIG.analytics = validConfiguration
            const gtag = vi.fn()
            window.gtag = gtag

            renderPreferences()
            await user.click(screen.getByRole('button', {
                name: 'Allow analytics',
            }))
            gtag.mockClear()

            const getItem = vi.spyOn(Storage.prototype, 'getItem')

            dispatchStorageChange({
                key,
                newValue,
                oldValue: 'granted',
            })
            expect(getItem).toHaveBeenCalledOnce()
            expect(getItem).toHaveBeenCalledWith(
                ANALYTICS_PREFERENCE_KEY,
            )
            getItem.mockRestore()

            trackPageView('/')

            expect(gtag).not.toHaveBeenCalledWith(
                'consent',
                'update',
                expect.objectContaining({analytics_storage: 'denied'}),
            )
            expect(gtag).toHaveBeenCalledWith(
                'event',
                'page_view',
                {page_path: '/'},
            )
        },
    )

    it('keeps_a_failed_local_denial_off_during_storage_synchronization', async () => {
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
        setItem.mockRestore()
        gtag.mockClear()

        const getItem = vi.spyOn(Storage.prototype, 'getItem')

        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: 'granted',
            oldValue: null,
        })
        expect(getItem).toHaveBeenCalledOnce()
        expect(getItem).toHaveBeenCalledWith(ANALYTICS_PREFERENCE_KEY)
        getItem.mockRestore()

        trackPageView('/')

        expect(gtag).not.toHaveBeenCalled()
        expect(screen.getByRole('status')).toHaveTextContent(
            /could not save your choice/i,
        )
    })

    it('fails_closed_when_the_subscription_reconciliation_read_throws', () => {
        window.APP_CONFIG.analytics = validConfiguration
        const gtag = vi.fn()
        window.gtag = gtag
        const getItem = vi.spyOn(Storage.prototype, 'getItem')
            .mockImplementation(() => {
                throw new Error('Storage unavailable')
            })

        renderPreferences()

        const initialReads = getItem.mock.calls.length

        expect(screen.getByRole('region', {
            name: 'Analytics preferences',
        })).toBeInTheDocument()
        expect(gtag).not.toHaveBeenCalled()
        expect(document.getElementById('kennen-ga4-script')).toBeNull()

        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: 'granted',
            oldValue: null,
        })
        expect(getItem).toHaveBeenCalledTimes(initialReads + 1)

        getItem.mockRestore()
    })

    it('fails_closed_when_accessing_subscription_storage_throws', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')
        const preferenceStorage = window.localStorage
        const gtag = vi.fn()
        window.gtag = gtag
        const localStorage = vi.spyOn(window, 'localStorage', 'get')
            .mockReturnValueOnce(preferenceStorage)
            .mockImplementation(() => {
                throw new Error('Storage unavailable')
            })

        try {
            renderPreferences()

            expect(screen.queryByRole('region', {
                name: 'Analytics preferences',
            })).not.toBeInTheDocument()
            expect(screen.queryByRole('button', {
                name: 'Analytics preferences',
            })).not.toBeInTheDocument()
            trackPageView('/')
            expect(gtag).not.toHaveBeenCalled()
            expect(document.getElementById('kennen-ga4-script')).toBeNull()
        } finally {
            localStorage.mockRestore()
        }
    })

    it.each([
        ['preference removal', ANALYTICS_PREFERENCE_KEY],
        ['storage clear', null],
    ] as const)(
        'cross_tab_%s_resets_reopened_preferences_to_a_required_choice',
        async (_description, key) => {
            const user = userEvent.setup()
            window.APP_CONFIG.analytics = validConfiguration
            window.localStorage.setItem(
                ANALYTICS_PREFERENCE_KEY,
                'granted',
            )

            renderPreferences()
            await user.click(screen.getByRole('button', {
                name: 'Analytics preferences',
            }))
            expect(screen.getByRole('button', {name: 'Close'}))
                .toBeInTheDocument()

            window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
            dispatchStorageChange({
                key,
                newValue: null,
                oldValue: key === null ? null : 'granted',
            })

            expect(screen.getByRole('region', {
                name: 'Analytics preferences',
            })).toBeInTheDocument()
            expect(screen.queryByRole('button', {name: 'Close'}))
                .not.toBeInTheDocument()
            expect(screen.queryByRole('button', {
                name: 'Analytics preferences',
            })).not.toBeInTheDocument()
        },
    )

    it.each([
        ['grant', 'granted'],
        ['denial', 'denied'],
    ] as const)(
        'cross_tab_%s_restores_focus_when_the_initial_choice_closes',
        (_description, preference) => {
            window.APP_CONFIG.analytics = validConfiguration

            renderPreferences()

            const allowButton = screen.getByRole('button', {
                name: 'Allow analytics',
            })
            allowButton.focus()

            window.localStorage.setItem(
                ANALYTICS_PREFERENCE_KEY,
                preference,
            )
            dispatchStorageChange({
                key: ANALYTICS_PREFERENCE_KEY,
                newValue: preference,
                oldValue: null,
            })

            expect(screen.getByRole('main')).toHaveFocus()
        },
    )

    it('cross_tab_removal_restores_focus_when_the_footer_control_disappears', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        renderPreferences()

        const preferencesButton = screen.getByRole('button', {
            name: 'Analytics preferences',
        })
        preferencesButton.focus()

        window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: null,
            oldValue: 'granted',
        })

        expect(screen.getByRole('main')).toHaveFocus()
    })

    it.each([
        ['another local-storage key', 'unrelated', window.localStorage],
        [
            'the same session-storage key',
            ANALYTICS_PREFERENCE_KEY,
            window.sessionStorage,
        ],
    ] as const)(
        'ignores %s while still observing the preference key',
        async (_description, unrelatedKey, storageArea) => {
            const user = userEvent.setup()
            window.APP_CONFIG.analytics = validConfiguration
            const gtag = vi.fn()
            window.gtag = gtag

            renderPreferences()
            await user.click(screen.getByRole('button', {
                name: 'Allow analytics',
            }))
            gtag.mockClear()

            dispatchStorageChange({
                key: unrelatedKey,
                newValue: 'denied',
                oldValue: null,
                storageArea,
            })
            trackPageView('/')

            expect(gtag).toHaveBeenCalledWith(
                'event',
                'page_view',
                {page_path: '/'},
            )

            gtag.mockClear()
            window.localStorage.setItem(
                ANALYTICS_PREFERENCE_KEY,
                'denied',
            )
            dispatchStorageChange({
                key: ANALYTICS_PREFERENCE_KEY,
                newValue: 'denied',
                oldValue: 'granted',
            })
            trackPageView('/')

            expect(gtag).toHaveBeenCalledTimes(1)
            expect(gtag).toHaveBeenCalledWith(
                'consent',
                'update',
                expect.objectContaining({analytics_storage: 'denied'}),
            )
        },
    )

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
