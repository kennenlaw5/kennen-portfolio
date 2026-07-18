import {afterEach, describe, expect, it, vi} from 'vitest'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

const setNavigatorValue = (key: string, value: unknown) => {
    Object.defineProperty(window.navigator, key, {
        configurable: true,
        value,
    })
}

const createSendBeaconMock = (result: boolean) => (
    vi.fn<(url: string | URL, data?: BodyInit | null) => boolean>(() => result)
)

describe('trackEvent', () => {
    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
        setNavigatorValue('doNotTrack', undefined)
        setNavigatorValue('sendBeacon', undefined)
        window.history.replaceState({}, '', '/')
    })

    it('sends an anonymous event through sendBeacon', async () => {
        const sendBeacon = createSendBeaconMock(true)
        setNavigatorValue('sendBeacon', sendBeacon)
        window.history.replaceState({}, '', '/experience')

        trackEvent(ANALYTICS_EVENTS.PROJECT_LINK_CLICKED, {label: 'Amazon Autos'})

        expect(sendBeacon).toHaveBeenCalledOnce()
        expect(sendBeacon.mock.calls[0][0]).toBe('/api/analytics/events')

        const body = sendBeacon.mock.calls[0][1] as Blob
        expect(JSON.parse(await body.text())).toEqual({
            event: 'project_link_clicked',
            path: '/experience',
            label: 'Amazon Autos',
        })
    })

    it('uses fetch when sendBeacon cannot queue the event', () => {
        const fetchMock = vi.fn(() => Promise.resolve(new Response()))
        setNavigatorValue('sendBeacon', createSendBeaconMock(false))
        vi.stubGlobal('fetch', fetchMock)

        trackEvent(ANALYTICS_EVENTS.PAGE_VIEW)

        expect(fetchMock).toHaveBeenCalledWith('/api/analytics/events', expect.objectContaining({
            method: 'POST',
            keepalive: true,
        }))
    })

    it('honors the browser do-not-track preference', () => {
        const sendBeacon = createSendBeaconMock(true)
        const fetchMock = vi.fn()
        setNavigatorValue('doNotTrack', '1')
        setNavigatorValue('sendBeacon', sendBeacon)
        vi.stubGlobal('fetch', fetchMock)

        trackEvent(ANALYTICS_EVENTS.PAGE_VIEW)

        expect(sendBeacon).not.toHaveBeenCalled()
        expect(fetchMock).not.toHaveBeenCalled()
    })
})
