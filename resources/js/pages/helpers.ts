import {trackResumeDownloadClicked} from 'JS/analytics'
import {TResumePlacement} from 'JS/analytics/contracts'

export const RESUME_DOWNLOAD_PATH = '/resume/download'

export const trackResumeDownloadIntent = (
    placement: TResumePlacement,
): void => {
    trackResumeDownloadClicked(placement)
}
