import {
    ANALYTICS_EVENT_NAMES,
    TAnalyticsEvent,
    TCanonicalPagePath,
} from 'JS/analytics/contracts'
import {parseAnalyticsRuntimeConfig} from 'JS/analytics/runtimeConfig'

export const ANALYTICS_PREFERENCE_KEY = 'kennen.analytics-consent.v1'

const GA4_SCRIPT_ID = 'kennen-ga4-script'

const DENIED_CONSENT = {
    ad_personalization: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    analytics_storage: 'denied',
} as const

const GRANTED_ANALYTICS_CONSENT = {
    analytics_storage: 'granted',
} as const

export type TAnalyticsPreference = 'denied' | 'granted'

type TPreferenceStorage = Pick<Storage, 'getItem' | 'setItem'>

type TAnalyticsEngineOptions = {
    browserDocument?: Document
    browserNavigator?: Navigator
    browserWindow?: Window
    configuration?: unknown
    storage?: TPreferenceStorage
}

export type TAnalyticsEngine = {
    getPreference: () => TAnalyticsPreference | null
    hasEffectivePermission: () => boolean
    initialize: () => boolean
    setPreference: (preference: TAnalyticsPreference) => boolean
    trackEvent: (event: TAnalyticsEvent) => void
}

const readPreference = (
    storage: TPreferenceStorage | null,
): TAnalyticsPreference | null => {
    try {
        const preference = storage?.getItem(ANALYTICS_PREFERENCE_KEY)

        return preference === 'denied' || preference === 'granted'
            ? preference
            : null
    } catch {
        return null
    }
}

const writePreference = (
    storage: TPreferenceStorage | null,
    preference: TAnalyticsPreference,
): boolean => {
    if (storage === null) {
        return false
    }

    try {
        storage.setItem(ANALYTICS_PREFERENCE_KEY, preference)

        return true
    } catch {
        return false
    }
}

const getCanonicalPageLocation = (
    browserWindow: Window,
    pagePath: TCanonicalPagePath | '/',
): string => (
    new URL(pagePath, browserWindow.location.origin).toString()
)

export const createAnalyticsEngine = ({
    browserDocument = document,
    browserNavigator = navigator,
    browserWindow = window,
    configuration = window.APP_CONFIG.analytics,
    storage,
}: TAnalyticsEngineOptions = {}): TAnalyticsEngine => {
    let active = false
    let configured = false
    let currentPreference: TAnalyticsPreference | null = null
    const preferenceStorage = (() => {
        if (storage !== undefined) {
            return storage
        }

        try {
            return browserWindow.localStorage
        } catch {
            return null
        }
    })()

    const getPreference = (): TAnalyticsPreference | null => (
        currentPreference ?? readPreference(preferenceStorage)
    )

    const hasEffectivePermission = (): boolean => (
        parseAnalyticsRuntimeConfig(configuration) !== null
        && getPreference() === 'granted'
        && browserNavigator.doNotTrack !== '1'
        && browserNavigator.globalPrivacyControl !== true
    )

    const getOrCreateGtag = (): NonNullable<Window['gtag']> => {
        if (typeof browserWindow.gtag === 'function') {
            return browserWindow.gtag
        }

        browserWindow.dataLayer = browserWindow.dataLayer ?? []
        browserWindow.gtag = function gtag(): void {
            browserWindow.dataLayer?.push(arguments)
        }

        return browserWindow.gtag
    }

    const loadScript = (measurementId: string): void => {
        if (browserDocument.getElementById(GA4_SCRIPT_ID) !== null) {
            return
        }

        const script = browserDocument.createElement('script')
        script.id = GA4_SCRIPT_ID
        script.async = true
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
        browserDocument.head.appendChild(script)
    }

    const denyActiveAnalytics = (): void => {
        if (!active) {
            return
        }

        try {
            browserWindow.gtag?.('consent', 'update', DENIED_CONSENT)
        } catch {
            // Analytics failures must never affect the application.
        } finally {
            active = false
        }
    }

    const initialize = (): boolean => {
        const runtimeConfig = parseAnalyticsRuntimeConfig(configuration)

        if (runtimeConfig === null || !hasEffectivePermission()) {
            denyActiveAnalytics()

            return false
        }

        if (configured) {
            if (!active) {
                try {
                    browserWindow.gtag?.(
                        'consent',
                        'update',
                        GRANTED_ANALYTICS_CONSENT,
                    )
                } catch {
                    active = false

                    return false
                }
            }

            active = true

            return true
        }

        try {
            const safeRoot = getCanonicalPageLocation(browserWindow, '/')
            const gtag = getOrCreateGtag()

            gtag('consent', 'default', DENIED_CONSENT)
            gtag('consent', 'update', GRANTED_ANALYTICS_CONSENT)
            gtag('js', new Date())
            gtag('config', runtimeConfig.measurement_id, {
                ignore_referrer: true,
                page_location: safeRoot,
                page_referrer: safeRoot,
                send_page_view: false,
            })
            loadScript(runtimeConfig.measurement_id)

            configured = true
            active = true

            return true
        } catch {
            active = false

            return false
        }
    }

    const setPreference = (preference: TAnalyticsPreference): boolean => {
        const stored = writePreference(preferenceStorage, preference)
        currentPreference = preference === 'denied' || !stored
            ? 'denied'
            : 'granted'

        if (preference === 'denied' || !stored) {
            denyActiveAnalytics()

            return stored
        }

        initialize()

        return true
    }

    const trackEvent = (event: TAnalyticsEvent): void => {
        const runtimeConfig = parseAnalyticsRuntimeConfig(configuration)

        if (runtimeConfig === null || !initialize()) {
            return
        }

        try {
            if (event.name === ANALYTICS_EVENT_NAMES.PAGE_VIEW) {
                const safeRoot = getCanonicalPageLocation(browserWindow, '/')

                browserWindow.gtag?.(
                    'config',
                    runtimeConfig.measurement_id,
                    {
                        page_location: getCanonicalPageLocation(
                            browserWindow,
                            event.parameters.page_path,
                        ),
                        page_referrer: safeRoot,
                        send_page_view: false,
                        update: true,
                    },
                )
            }

            browserWindow.gtag?.('event', event.name, event.parameters)
        } catch {
            // Analytics failures must never affect the application.
        }
    }

    return {
        getPreference,
        hasEffectivePermission,
        initialize,
        setPreference,
        trackEvent,
    }
}
