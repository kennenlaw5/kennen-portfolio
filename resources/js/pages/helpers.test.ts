import axios from 'axios'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {downloadResume} from 'JS/pages/helpers'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

vi.mock('axios', () => ({
    default: {get: vi.fn()},
}))

vi.mock('JS/analytics', () => ({
    ANALYTICS_EVENTS: {RESUME_DOWNLOAD: 'resume_download'},
    trackEvent: vi.fn(),
}))

describe('downloadResume', () => {
    beforeEach(() => {
        vi.mocked(axios.get).mockReset()
        vi.mocked(trackEvent).mockReset()
    })

    it('downloads the configured PDF and records a successful download', async () => {
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
        const createObjectURL = vi.fn(() => 'blob:resume')
        const revokeObjectURL = vi.fn()
        Object.defineProperty(window.URL, 'createObjectURL', {configurable: true, value: createObjectURL})
        Object.defineProperty(window.URL, 'revokeObjectURL', {configurable: true, value: revokeObjectURL})
        vi.mocked(axios.get).mockResolvedValue({data: 'resume'})

        await downloadResume()

        expect(axios.get).toHaveBeenCalledWith('/resume.pdf', {responseType: 'blob'})
        expect(click).toHaveBeenCalledOnce()
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:resume')
        expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.RESUME_DOWNLOAD)
    })

    it('does not record a failed download', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        vi.mocked(axios.get).mockRejectedValue(new Error('Download failed'))

        await downloadResume()

        expect(trackEvent).not.toHaveBeenCalled()
    })
})
