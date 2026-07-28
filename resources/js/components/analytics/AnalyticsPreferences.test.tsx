import React from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, Route, Routes} from 'react-router'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import AnalyticsConsent from 'Components/analytics/AnalyticsConsent'
import AnalyticsConsentSpacer from 'Components/analytics/AnalyticsConsentSpacer'
import {
    AnalyticsConsentLayoutProvider,
} from 'Components/analytics/AnalyticsConsentLayoutContext'
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

const createRectangle = ({
    height,
    left = 0,
    top = 0,
    width = 0,
}: {
    height: number
    left?: number
    top?: number
    width?: number
}): DOMRect => ({
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => undefined,
})

const installResizeObserver = () => {
    const callbacks: ResizeObserverCallback[] = []

    vi.stubGlobal('ResizeObserver', class {
        public constructor(callback: ResizeObserverCallback) {
            callbacks.push(callback)
        }

        public disconnect = vi.fn()

        public observe = vi.fn()

        public unobserve = vi.fn()
    })

    return {
        notifyLatest: (): void => {
            const callback = callbacks[callbacks.length - 1]

            if (callback === undefined) {
                throw new Error('Expected a ResizeObserver callback')
            }

            callback([], {} as ResizeObserver)
        },
    }
}

const renderPreferences = () => render(
    <AnalyticsPreferencesProvider>
        <AnalyticsConsentLayoutProvider>
            <AnalyticsConsent />
            <main tabIndex={-1}>
                <a href="/games">Open games</a>
            </main>
            <Footer />
            <AnalyticsConsentSpacer />
        </AnalyticsConsentLayoutProvider>
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

beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
})

afterEach(() => {
    vi.useRealTimers()
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
        const scrollTo = vi.mocked(window.scrollTo)
        const scrollPosition = 437
        vi.spyOn(window, 'scrollY', 'get').mockReturnValue(scrollPosition)
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 240, width: 1280})
                : createRectangle({height: 0})
        })
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
        const main = screen.getByRole('main')
        const focusMain = vi.spyOn(main, 'focus')
        const heading = screen.getByRole('heading', {
            name: 'Analytics preferences',
        })

        expect(region).toHaveTextContent('Google Analytics')
        expect(region).toHaveTextContent(/limited usage data/i)
        expect(region).toHaveTextContent(
            /do not include contact details or other information that directly identifies you/i,
        )
        expect(region).toHaveClass(
            'fixed',
            'inset-x-0',
            'bottom-0',
            'z-40',
            'overflow-y-auto',
        )
        expect(region.className).toContain('analyticsConsentPanel')
        expect(region).not.toHaveAttribute('data-analytics-consent-panel')
        expect(region).not.toHaveClass('sticky', 'order-last')
        const spacer = screen.getByTestId('analytics-consent-spacer')
        expect(spacer).toHaveAttribute('aria-hidden', 'true')
        expect(spacer).toHaveStyle({height: '240px'})
        expect(window.scrollTo).not.toHaveBeenCalled()
        expect(allowButton.className).toBe(denyButton.className)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.queryByRole('button', {name: 'Close'}))
            .not.toBeInTheDocument()
        expect(pageLink).toHaveAttribute('href', '/games')
        expect(pageLink).not.toHaveAttribute('aria-hidden')
        expect(heading).toHaveFocus()

        await user.tab()
        expect(allowButton).toHaveFocus()
        await user.tab()
        expect(denyButton).toHaveFocus()

        await user.click(denyButton)
        expect(focusMain).toHaveBeenCalledWith({preventScroll: true})
        expect(scrollTo).not.toHaveBeenCalled()
        expect(main).toHaveFocus()

        const closingPanel = screen.getByTestId('analytics-consent-panel')
        expect(closingPanel).toHaveAttribute('aria-hidden', 'true')
        expect(closingPanel.className)
            .toContain('analyticsConsentPanelClosing')
        expect(spacer).toHaveStyle({height: '0px'})

        fireEvent.transitionEnd(closingPanel, {
            propertyName: 'transform',
        })

        expect(screen.getByTestId('analytics-consent-panel'))
            .toHaveAttribute('aria-hidden', 'true')
        expect(screen.getByTestId('analytics-consent-panel').className)
            .toContain('analyticsConsentPanelClosed')
        expect(screen.getByTestId('analytics-consent-spacer'))
            .toHaveStyle({height: '0px'})
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
        const footer = screen.getByRole('contentinfo')
        const region = screen.getByRole('region', {
            name: 'Analytics preferences',
        })
        const spacer = screen.getByTestId('analytics-consent-spacer')
        const page = screen.getByTestId('analytics-consent-page')

        expect(main).toHaveAttribute('tabindex', '-1')
        expect(page)
            .not.toHaveClass('[overflow-anchor:none]')
        expect(region).toHaveClass('fixed', 'bottom-0')
        expect(region.compareDocumentPosition(main)
            & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
        expect(main.compareDocumentPosition(footer)
            & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
        expect(footer.parentElement).toBe(page)
        expect(page.nextElementSibling).toBe(spacer)

        await user.click(screen.getByRole('button', {name: 'No thanks'}))

        expect(main).toHaveFocus()
    })

    it('moves_page_content_with_the_reopened_drawer', () => {
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        render(
            <MemoryRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<p>Page content</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const page = screen.getByTestId('analytics-consent-page')
        expect(page.className)
            .toContain('analyticsConsentPageOpening')
        expect(page).toHaveClass('[overflow-anchor:none]')
        expect(page).toHaveStyle(
            '--analytics-consent-panel-height: 220px',
        )
        expect(page).toContainElement(screen.getByRole('main'))
        expect(page).toContainElement(screen.getByRole('contentinfo'))

        fireEvent.transitionEnd(
            screen.getByTestId('analytics-consent-panel'),
            {propertyName: 'transform'},
        )

        expect(page.className)
            .not.toContain('analyticsConsentPageOpening')
        expect(page).not.toHaveClass('[overflow-anchor:none]')
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
        const scrollTo = vi.mocked(window.scrollTo)
        const scrollPosition = 283
        const resizeObserver = installResizeObserver()
        let panelHeight = 220
        vi.spyOn(window, 'scrollY', 'get').mockReturnValue(scrollPosition)
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: panelHeight, width: 1280})
                : createRectangle({height: 0})
        })
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
        const restoreReopenFocus = vi.spyOn(reopenButton, 'focus')
        await user.click(reopenButton)
        restoreReopenFocus.mockClear()
        expect(screen.getByRole('region', {
            name: 'Analytics preferences',
        })).toHaveClass('fixed', 'bottom-0')
        expect(screen.getByRole('region', {
            name: 'Analytics preferences',
        })).not.toHaveClass('sticky', 'order-last')
        const openingPanel = screen.getByTestId(
            'analytics-consent-panel',
        )
        const heading = screen.getByRole('heading', {
            name: 'Analytics preferences',
        })
        const spacer = screen.getByTestId('analytics-consent-spacer')
        expect(openingPanel.className)
            .toContain('analyticsConsentPanelOpening')
        expect(spacer).toHaveStyle({height: '220px'})
        expect(scrollTo).toHaveBeenCalledWith({
            behavior: 'auto',
            top: panelHeight,
        })
        expect(heading).not.toHaveFocus()
        expect(screen.getByText(
            /selecting no thanks turns off analytics/i,
        )).toBeInTheDocument()

        panelHeight = 230
        act(() => {
            resizeObserver.notifyLatest()
        })
        expect(spacer).toHaveStyle({height: '230px'})
        expect(spacer).toHaveStyle({height: '230px'})
        expect(heading).not.toHaveFocus()

        fireEvent.transitionEnd(openingPanel, {
            propertyName: 'transform',
        })
        expect(heading).toHaveFocus()
        scrollTo.mockClear()
        panelHeight = 260
        act(() => {
            resizeObserver.notifyLatest()
        })

        expect(spacer).toHaveStyle({height: '260px'})
        expect(scrollTo).not.toHaveBeenCalled()

        scrollTo.mockClear()
        await user.click(screen.getByRole('button', {name: 'No thanks'}))

        expect(restoreReopenFocus)
            .toHaveBeenCalledWith({preventScroll: true})
        expect(scrollTo).not.toHaveBeenCalled()
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
        fireEvent.transitionEnd(
            screen.getByTestId('analytics-consent-panel'),
            {propertyName: 'transform'},
        )
        expect(heading).toHaveFocus()
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

    it('waits_for_panel_measurement_before_scrolling_to_reopened_preferences', () => {
        const resizeObserver = installResizeObserver()
        let panelHeight = 0
        let spacerHeightAtScroll: string | null = null
        vi.mocked(window.scrollTo).mockImplementation(() => {
            spacerHeightAtScroll = screen.getByTestId(
                'analytics-consent-spacer',
            ).style.height
        })
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: panelHeight, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        expect(window.scrollTo).not.toHaveBeenCalled()

        panelHeight = 220
        act(() => {
            resizeObserver.notifyLatest()
        })

        expect(spacerHeightAtScroll).toBe('220px')
    })

    it('keeps_closed_preferences_measured_for_the_next_open', () => {
        let spacerHeightAtScroll: string | null = null
        vi.mocked(window.scrollTo).mockImplementation(() => {
            spacerHeightAtScroll = screen.getByTestId(
                'analytics-consent-spacer',
            ).style.height
        })
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()

        const panel = screen.getByTestId('analytics-consent-panel')
        expect(panel).toHaveAttribute('aria-hidden', 'true')
        expect(panel).toHaveAttribute('inert')
        expect(panel.className)
            .toContain('analyticsConsentPanelClosed')
        expect(panel).toHaveTextContent('Close')
        expect(screen.getByTestId('analytics-consent-spacer'))
            .toHaveStyle({height: '0px'})

        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        expect(spacerHeightAtScroll).toBe('220px')
    })

    it('keeps_reserved_space_mounted_when_reopening_preferences', () => {
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()

        const closedSpacer = screen.getByTestId(
            'analytics-consent-spacer',
        )
        expect(closedSpacer).toHaveStyle({height: '0px'})

        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const openingSpacer = screen.getByTestId(
            'analytics-consent-spacer',
        )
        expect(openingSpacer).toBe(closedSpacer)
        expect(openingSpacer).toHaveStyle({height: '220px'})
    })

    it('scrolls_to_the_final_bottom_when_reserved_space_opens', () => {
        const scrollTo = vi.mocked(window.scrollTo)
        vi.spyOn(
            document.documentElement,
            'scrollHeight',
            'get',
        ).mockReturnValue(1000)
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            if (this.dataset.testid === 'analytics-consent-panel') {
                return createRectangle({height: 220, width: 1280})
            }

            return createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        expect(scrollTo).toHaveBeenCalledWith({
            behavior: 'auto',
            top: 1220,
        })
    })

    it('resets_the_drawer_scroll_position_before_reopening', () => {
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const panel = screen.getByTestId('analytics-consent-panel')
        fireEvent.transitionEnd(panel, {propertyName: 'transform'})
        panel.scrollTop = 180
        fireEvent.click(screen.getByRole('button', {name: 'Close'}))
        fireEvent.transitionEnd(panel, {propertyName: 'transform'})

        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        expect(panel.scrollTop).toBe(0)
    })

    it('resets_the_drawer_scroll_position_when_closing_is_interrupted', () => {
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const panel = screen.getByTestId('analytics-consent-panel')
        fireEvent.transitionEnd(panel, {propertyName: 'transform'})
        panel.scrollTop = 180
        fireEvent.click(screen.getByRole('button', {name: 'Close'}))
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        expect(panel.scrollTop).toBe(0)
    })

    it('remeasures_changed_content_without_resize_observer_support', () => {
        let spacerHeightAtScroll: string | null = null
        vi.stubGlobal('ResizeObserver', undefined)
        vi.mocked(window.scrollTo).mockImplementation(() => {
            spacerHeightAtScroll = screen.getByTestId(
                'analytics-consent-spacer',
            ).style.height
        })
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            if (this.dataset.testid !== 'analytics-consent-panel') {
                return createRectangle({height: 0})
            }

            const hasCloseButton = Array.from(
                this.querySelectorAll('button'),
            ).some((button) => button.textContent === 'Close')

            return createRectangle({
                height: hasCloseButton ? 220 : 160,
                width: 1280,
            })
        })
        window.APP_CONFIG.analytics = validConfiguration

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {name: 'No thanks'}))
        const panel = screen.getByTestId('analytics-consent-panel')
        fireEvent.transitionEnd(panel, {propertyName: 'transform'})
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        expect(spacerHeightAtScroll).toBe('220px')
    })

    it('remeasures_viewport_changes_without_resize_observer_support', () => {
        let panelHeight = 160
        vi.stubGlobal('ResizeObserver', undefined)
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: panelHeight, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))
        const panel = screen.getByTestId('analytics-consent-panel')
        const spacer = screen.getByTestId('analytics-consent-spacer')
        fireEvent.transitionEnd(panel, {propertyName: 'transform'})
        expect(spacer).toHaveStyle({height: '160px'})

        panelHeight = 220
        fireEvent(window, new Event('resize'))

        expect(spacer).toHaveStyle({height: '220px'})
    })

    it('keeps_transitioning_preferences_out_of_the_tab_order', () => {
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const panel = screen.getByTestId('analytics-consent-panel')
        const allowButton = screen.getByRole('button', {
            name: 'Allow analytics',
        })
        expect(allowButton).toHaveAttribute('tabindex', '-1')

        fireEvent.transitionEnd(panel, {propertyName: 'transform'})
        expect(allowButton).not.toHaveAttribute('tabindex')

        fireEvent.click(screen.getByRole('button', {name: 'Close'}))
        expect(allowButton).toHaveAttribute('tabindex', '-1')
    })

    it('does_not_add_the_close_action_while_the_first_choice_closes', () => {
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration

        renderPreferences()

        const panel = screen.getByTestId('analytics-consent-panel')
        const hasCloseAction = (): boolean => Array.from(
            panel.querySelectorAll('button'),
        ).some((button) => button.textContent === 'Close')

        expect(hasCloseAction()).toBe(false)
        fireEvent.click(screen.getByRole('button', {name: 'No thanks'}))

        expect(panel.className)
            .toContain('analyticsConsentPanelClosing')
        expect(hasCloseAction()).toBe(false)

        fireEvent.transitionEnd(panel, {propertyName: 'transform'})
        expect(hasCloseAction()).toBe(true)
    })

    it('opens_without_animation_when_reduced_motion_is_requested', async () => {
        const user = userEvent.setup()
        const scrollTo = vi.mocked(window.scrollTo)
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
            addEventListener: vi.fn(),
            matches: true,
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            removeEventListener: vi.fn(),
        }))
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        await user.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const panel = screen.getByTestId('analytics-consent-panel')

        expect(panel.className)
            .not.toContain('analyticsConsentPanelOpening')
        expect(scrollTo).toHaveBeenCalledWith({
            behavior: 'auto',
            top: 220,
        })
        expect(screen.getByRole('heading', {
            name: 'Analytics preferences',
        })).toHaveFocus()
    })

    it('supports_legacy_reduced_motion_listeners', () => {
        const addListener = vi.fn()
        const removeListener = vi.fn()
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
            addListener,
            matches: false,
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            removeListener,
        }))
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        const {unmount} = renderPreferences()

        expect(addListener).toHaveBeenCalledOnce()
        const listener = addListener.mock.calls[0]?.[0]
        expect(listener).toBeTypeOf('function')

        unmount()

        expect(removeListener).toHaveBeenCalledOnce()
        expect(removeListener).toHaveBeenCalledWith(listener)
    })

    it('finishes_opening_when_reduced_motion_changes_during_transition', async () => {
        const user = userEvent.setup()
        let matchesReducedMotion = false
        let notifyReducedMotionChange: (() => void) | null = null
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
            addEventListener: (
                _event: string,
                listener: (event: MediaQueryListEvent) => void,
            ) => {
                notifyReducedMotionChange = () => listener({
                    matches: matchesReducedMotion,
                } as MediaQueryListEvent)
            },
            get matches() {
                return matchesReducedMotion
            },
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            removeEventListener: vi.fn(),
        })))
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        await user.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        matchesReducedMotion = true
        act(() => {
            notifyReducedMotionChange?.()
        })

        expect(screen.getByTestId('analytics-consent-panel').className)
            .not.toContain('analyticsConsentPanelOpening')
        expect(screen.getByRole('heading', {
            name: 'Analytics preferences',
        })).toHaveFocus()
    })

    it('finishes_opening_when_the_panel_height_cannot_be_measured', () => {
        vi.useFakeTimers()
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockReturnValue(createRectangle({height: 0}))
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const panel = screen.getByTestId('analytics-consent-panel')
        const heading = screen.getByRole('heading', {
            name: 'Analytics preferences',
        })

        expect(panel.className).toContain('analyticsConsentPanelOpening')
        expect(heading).not.toHaveFocus()

        act(() => {
            vi.advanceTimersByTime(349)
        })
        expect(panel.className).toContain('analyticsConsentPanelOpening')
        expect(heading).not.toHaveFocus()

        act(() => {
            vi.advanceTimersByTime(1)
        })
        expect(panel.className)
            .not.toContain('analyticsConsentPanelOpening')
        expect(heading).toHaveFocus()
    })

    it('focuses_preferences_after_the_open_transition_fallback', () => {
        vi.useFakeTimers()
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            return this.dataset.testid === 'analytics-consent-panel'
                ? createRectangle({height: 220, width: 1280})
                : createRectangle({height: 0})
        })
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const heading = screen.getByRole('heading', {
            name: 'Analytics preferences',
        })

        expect(heading).not.toHaveFocus()

        act(() => {
            vi.advanceTimersByTime(349)
        })
        expect(heading).not.toHaveFocus()

        act(() => {
            vi.advanceTimersByTime(1)
        })
        expect(heading).toHaveFocus()
    })

    it('closes_immediately_when_reduced_motion_is_requested', () => {
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
            addEventListener: vi.fn(),
            matches: true,
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            removeEventListener: vi.fn(),
        }))
        window.APP_CONFIG.analytics = validConfiguration

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {name: 'No thanks'}))

        expect(screen.getByTestId('analytics-consent-panel'))
            .toHaveAttribute('aria-hidden', 'true')
        expect(screen.getByTestId('analytics-consent-panel').className)
            .toContain('analyticsConsentPanelClosed')
        expect(screen.getByTestId('analytics-consent-spacer'))
            .toHaveStyle({height: '0px'})
    })

    it('finishes_closing_when_transition_end_is_not_delivered', () => {
        vi.useFakeTimers()
        window.APP_CONFIG.analytics = validConfiguration

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {name: 'No thanks'}))

        expect(screen.getByTestId('analytics-consent-panel').className)
            .toContain('analyticsConsentPanelClosing')

        act(() => {
            vi.advanceTimersByTime(349)
        })
        expect(screen.getByTestId('analytics-consent-panel'))
            .toBeInTheDocument()

        act(() => {
            vi.advanceTimersByTime(1)
        })
        expect(screen.getByTestId('analytics-consent-panel'))
            .toHaveAttribute('aria-hidden', 'true')
        expect(screen.getByTestId('analytics-consent-panel').className)
            .toContain('analyticsConsentPanelClosed')
        expect(screen.getByTestId('analytics-consent-spacer'))
            .toHaveStyle({height: '0px'})
    })

    it('requires_the_layout_provider_for_consent_layout_consumers', () => {
        expect(() => render(<AnalyticsConsent />)).toThrow(
            /AnalyticsConsentLayoutProvider/,
        )
        expect(() => render(<AnalyticsConsentSpacer />)).toThrow(
            /AnalyticsConsentLayoutProvider/,
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

    it('keeps_the_close_action_while_a_cross_tab_choice_closes_reopened_preferences', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))

        const panel = screen.getByTestId('analytics-consent-panel')
        fireEvent.transitionEnd(panel, {propertyName: 'transform'})

        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: 'granted',
            oldValue: 'denied',
        })

        const hasCloseAction = (): boolean => Array.from(
            panel.querySelectorAll('button'),
        ).some((button) => button.textContent === 'Close')

        expect(panel.className)
            .toContain('analyticsConsentPanelClosing')
        expect(hasCloseAction()).toBe(true)

        fireEvent.transitionEnd(panel, {propertyName: 'transform'})

        expect(hasCloseAction()).toBe(true)
    })

    it('restores_reopen_focus_when_a_cross_tab_choice_closes_preferences', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'denied')

        renderPreferences()
        const preferencesButton = screen.getByRole('button', {
            name: 'Analytics preferences',
        })
        fireEvent.click(preferencesButton)

        const panel = screen.getByTestId('analytics-consent-panel')
        fireEvent.transitionEnd(panel, {propertyName: 'transform'})
        screen.getByRole('button', {name: 'Allow analytics'}).focus()

        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: 'granted',
            oldValue: 'denied',
        })

        expect(preferencesButton).toHaveFocus()
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

    it('cross_tab_removal_preserves_a_connected_page_focus_target', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        renderPreferences()

        const pageLink = screen.getByRole('link', {name: 'Open games'})
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            if (this.dataset.testid === 'analytics-consent-panel') {
                return createRectangle({
                    height: 220,
                    top: 500,
                    width: 1280,
                })
            }

            if (this === pageLink) {
                return createRectangle({
                    height: 30,
                    top: 200,
                    width: 160,
                })
            }

            return createRectangle({height: 0})
        })
        pageLink.focus()

        window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: null,
            oldValue: 'granted',
        })

        expect(screen.getByRole('region', {
            name: 'Analytics preferences',
        })).toHaveClass('fixed', 'bottom-0')
        expect(screen.getByText(
            /analytics preferences were reset in another tab/i,
        )).toHaveAttribute('aria-live', 'polite')
        expect(pageLink).toHaveFocus()
    })

    it('does_not_announce_a_storage_clear_when_consent_was_already_unset', () => {
        window.APP_CONFIG.analytics = validConfiguration

        renderPreferences()

        const pageLink = screen.getByRole('link', {name: 'Open games'})
        pageLink.focus()
        dispatchStorageChange({
            key: null,
            newValue: null,
            oldValue: null,
        })

        expect(screen.queryByText(
            /analytics preferences were reset in another tab/i,
        )).not.toBeInTheDocument()
        expect(pageLink).toHaveFocus()
    })

    it('cross_tab_reset_announcement_does_not_prescribe_a_choice', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(
            ANALYTICS_PREFERENCE_KEY,
            'granted',
        )

        renderPreferences()

        window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: null,
            oldValue: 'granted',
        })

        expect(screen.getByText(
            /analytics preferences were reset in another tab/i,
        )).toHaveTextContent(
            'Analytics preferences were reset in another tab. '
            + 'Review the available choices.',
        )
    })

    it('announces_a_background_cross_tab_reset_when_the_tab_becomes_visible', () => {
        let visibilityState: DocumentVisibilityState = 'hidden'
        vi.spyOn(document, 'visibilityState', 'get')
            .mockImplementation(() => visibilityState)
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(
            ANALYTICS_PREFERENCE_KEY,
            'granted',
        )

        renderPreferences()

        const pageLink = screen.getByRole('link', {name: 'Open games'})
        pageLink.focus()
        window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: null,
            oldValue: 'granted',
        })

        expect(screen.queryByText(
            /analytics preferences were reset in another tab/i,
        )).not.toBeInTheDocument()

        visibilityState = 'visible'
        fireEvent(document, new Event('visibilitychange'))

        expect(screen.getByText(
            /analytics preferences were reset in another tab/i,
        )).toHaveAttribute('aria-live', 'polite')
        expect(pageLink).toHaveFocus()
    })

    it('reconciles_cross_tab_focus_only_once_when_the_panel_resizes', () => {
        const resizeObserver = installResizeObserver()
        let pageLinkTop = 200
        let panelHeight = 220
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            if (this.dataset.testid === 'analytics-consent-panel') {
                return createRectangle({
                    height: panelHeight,
                    top: 500,
                    width: 1280,
                })
            }

            if (this.getAttribute('href') === '/games') {
                return createRectangle({
                    height: 30,
                    top: pageLinkTop,
                    width: 160,
                })
            }

            return createRectangle({height: 0})
        })

        renderPreferences()

        const pageLink = screen.getByRole('link', {name: 'Open games'})
        pageLink.focus()

        window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: null,
            oldValue: 'granted',
        })

        expect(pageLink).toHaveFocus()

        pageLinkTop = 600
        panelHeight = 260
        act(() => {
            resizeObserver.notifyLatest()
        })

        expect(pageLink).toHaveFocus()
    })

    it('defers_cross_tab_overlap_focus_until_the_panel_is_open', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            if (this.dataset.testid === 'analytics-consent-panel') {
                const isOpening = this.className.includes(
                    'analyticsConsentPanelOpening',
                )

                return createRectangle({
                    height: 320,
                    top: isOpening ? 700 : 400,
                    width: 1280,
                })
            }

            if (this.getAttribute('href') === '/games') {
                return createRectangle({
                    height: 30,
                    top: 650,
                    width: 160,
                })
            }

            return createRectangle({height: 0})
        })

        renderPreferences()

        fireEvent.click(screen.getByRole('button', {
            name: 'Analytics preferences',
        }))
        const pageLink = screen.getByRole('link', {name: 'Open games'})
        pageLink.focus()

        window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: null,
            oldValue: 'granted',
        })

        expect(pageLink).toHaveFocus()

        fireEvent.transitionEnd(
            screen.getByTestId('analytics-consent-panel'),
            {propertyName: 'transform'},
        )

        expect(screen.getByRole('heading', {
            name: 'Analytics preferences',
        })).toHaveFocus()
    })

    it('cross_tab_removal_moves_focus_when_the_page_target_would_be_covered', () => {
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockImplementation(function (this: HTMLElement) {
            if (this.dataset.testid === 'analytics-consent-panel') {
                return createRectangle({
                    height: 320,
                    top: 400,
                    width: 1280,
                })
            }

            if (this.getAttribute('href') === '/games') {
                return createRectangle({
                    height: 30,
                    top: 650,
                    width: 160,
                })
            }

            return createRectangle({height: 0})
        })

        renderPreferences()

        const pageLink = screen.getByRole('link', {name: 'Open games'})
        pageLink.focus()

        window.localStorage.removeItem(ANALYTICS_PREFERENCE_KEY)
        dispatchStorageChange({
            key: ANALYTICS_PREFERENCE_KEY,
            newValue: null,
            oldValue: 'granted',
        })

        expect(screen.getByRole('heading', {
            name: 'Analytics preferences',
        })).toHaveFocus()
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
        const scrollTo = vi.mocked(window.scrollTo)
        window.APP_CONFIG.analytics = validConfiguration
        window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, 'granted')

        renderPreferences()

        const reopenButton = screen.getByRole('button', {
            name: 'Analytics preferences',
        })
        await user.click(reopenButton)

        scrollTo.mockClear()
        await user.click(screen.getByRole('button', {name: 'Close'}))

        expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY))
            .toBe('granted')
        expect(scrollTo).not.toHaveBeenCalled()
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
