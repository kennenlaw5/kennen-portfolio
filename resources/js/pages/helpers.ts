import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

export const RESUME_DOWNLOAD_PATH = '/resume/download'

export const trackResumeDownloadIntent = () => {
    trackEvent(ANALYTICS_EVENTS.RESUME_DOWNLOAD)
}
