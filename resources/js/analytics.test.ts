import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    resetAnalyticsEngineForTests,
    trackContactLinkClicked,
    trackPageView,
    trackProjectLinkClicked,
    trackResumeDownloadClicked,
} from 'JS/analytics'
import {
    ANALYTICS_EVENT_NAMES,
    PROJECT_ANALYTICS_IDS,
} from 'JS/analytics/contracts'

const engineMocks = vi.hoisted(() => ({
    trackEvent: vi.fn(),
}))

vi.mock('JS/analytics/engine', () => ({
    createAnalyticsEngine: () => ({
        trackEvent: engineMocks.trackEvent,
    }),
}))

const setNavigatorValue = (key: string, value: unknown): void => {
    Object.defineProperty(window.navigator, key, {
        configurable: true,
        value,
    })
}

afterEach(() => {
    resetAnalyticsEngineForTests()
    engineMocks.trackEvent.mockReset()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    setNavigatorValue('sendBeacon', undefined)
})

describe('analytics facade', () => {
    it('analytics_never_posts_to_laravel', () => {
        const fetchMock = vi.fn()
        const sendBeaconMock = vi.fn()

        vi.stubGlobal('fetch', fetchMock)
        setNavigatorValue('sendBeacon', sendBeaconMock)

        trackPageView('/experience')
        trackContactLinkClicked('email')
        trackProjectLinkClicked(PROJECT_ANALYTICS_IDS.AMAZON_AUTOS)
        trackResumeDownloadClicked('home')

        expect(engineMocks.trackEvent.mock.calls).toEqual([
            [{
                name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
                parameters: {page_path: '/experience'},
            }],
            [{
                name: ANALYTICS_EVENT_NAMES.CONTACT_LINK_CLICKED,
                parameters: {contact_method: 'email'},
            }],
            [{
                name: ANALYTICS_EVENT_NAMES.PROJECT_LINK_CLICKED,
                parameters: {
                    project_id: PROJECT_ANALYTICS_IDS.AMAZON_AUTOS,
                },
            }],
            [{
                name: ANALYTICS_EVENT_NAMES.RESUME_DOWNLOAD_CLICKED,
                parameters: {placement: 'home'},
            }],
        ])
        expect(sendBeaconMock).not.toHaveBeenCalled()
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('analytics_failures_do_not_block_application_interactions', () => {
        engineMocks.trackEvent.mockImplementation(() => {
            throw new Error('Provider unavailable')
        })

        expect(() => trackPageView('/')).not.toThrow()
        expect(() => trackContactLinkClicked('linkedin')).not.toThrow()
        expect(() => trackProjectLinkClicked(
            PROJECT_ANALYTICS_IDS.AKIDO_LABS,
        )).not.toThrow()
        expect(() => trackResumeDownloadClicked('experience')).not.toThrow()
    })
})
