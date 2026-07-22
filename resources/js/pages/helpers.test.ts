import {beforeEach, describe, expect, it, vi} from 'vitest'
import {
    trackResumeDownloadIntent,
    RESUME_DOWNLOAD_PATH,
} from 'JS/pages/helpers'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    ANALYTICS_EVENTS: {RESUME_DOWNLOAD: 'resume_download'},
    trackEvent: vi.fn(),
}))

describe('trackResumeDownloadIntent', () => {
    beforeEach(() => {
        vi.mocked(trackEvent).mockReset()
    })

    it('exposes the same-origin download endpoint', () => {
        expect(RESUME_DOWNLOAD_PATH).toBe('/resume/download')
    })

    it('records a resume download intent', () => {
        trackResumeDownloadIntent()

        expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.RESUME_DOWNLOAD)
    })
})
