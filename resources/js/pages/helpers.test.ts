import {beforeEach, describe, expect, it, vi} from 'vitest'
import {
    trackResumeDownloadIntent,
    RESUME_DOWNLOAD_PATH,
} from 'JS/pages/helpers'
import {trackResumeDownloadClicked} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    trackResumeDownloadClicked: vi.fn(),
}))

describe('trackResumeDownloadIntent', () => {
    beforeEach(() => {
        vi.mocked(trackResumeDownloadClicked).mockReset()
    })

    it('exposes the same-origin download endpoint', () => {
        expect(RESUME_DOWNLOAD_PATH).toBe('/resume/download')
    })

    it('records a resume download intent', () => {
        trackResumeDownloadIntent('experience')

        expect(trackResumeDownloadClicked).toHaveBeenCalledWith('experience')
    })
})
