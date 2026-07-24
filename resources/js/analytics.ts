import {
    ANALYTICS_EVENT_NAMES,
    TAnalyticsEvent,
    TCanonicalPagePath,
    TContactMethod,
    TProjectAnalyticsId,
    TResumePlacement,
} from 'JS/analytics/contracts'
import {
    createAnalyticsEngine,
    TAnalyticsEngine,
} from 'JS/analytics/engine'

let analyticsEngine: TAnalyticsEngine | null = null

export const getAnalyticsEngine = (): TAnalyticsEngine => {
    analyticsEngine ??= createAnalyticsEngine()

    return analyticsEngine
}

export const resetAnalyticsEngineForTests = (): void => {
    analyticsEngine = null
}

const trackEvent = (event: TAnalyticsEvent): void => {
    try {
        getAnalyticsEngine().trackEvent(event)
    } catch {
        // Analytics failures must never affect application interactions.
    }
}

export const trackPageView = (pagePath: TCanonicalPagePath): void => {
    trackEvent({
        name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
        parameters: {page_path: pagePath},
    })
}

export const trackContactLinkClicked = (
    contactMethod: TContactMethod,
): void => {
    trackEvent({
        name: ANALYTICS_EVENT_NAMES.CONTACT_LINK_CLICKED,
        parameters: {contact_method: contactMethod},
    })
}

export const trackProjectLinkClicked = (
    projectId: TProjectAnalyticsId,
): void => {
    trackEvent({
        name: ANALYTICS_EVENT_NAMES.PROJECT_LINK_CLICKED,
        parameters: {project_id: projectId},
    })
}

export const trackResumeDownloadClicked = (
    placement: TResumePlacement,
): void => {
    trackEvent({
        name: ANALYTICS_EVENT_NAMES.RESUME_DOWNLOAD_CLICKED,
        parameters: {placement},
    })
}
