export const ANALYTICS_EVENTS = {
    CONTACT_LINK_CLICKED: 'contact_link_clicked',
    PAGE_VIEW: 'page_view',
    PROJECT_LINK_CLICKED: 'project_link_clicked',
    RESUME_DOWNLOAD: 'resume_download',
} as const

type TAnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

type TAnalyticsMetadata = {
    label?: string
}

export const trackEvent = (event: TAnalyticsEvent, metadata: TAnalyticsMetadata = {}) => {
    if (navigator.doNotTrack === '1') {
        return
    }

    const payload = JSON.stringify({
        event,
        path: window.location.pathname,
        ...metadata,
    })

    if (typeof navigator.sendBeacon === 'function') {
        const body = new Blob([payload], {type: 'application/json'})

        if (navigator.sendBeacon('/api/analytics/events', body)) {
            return
        }
    }

    void fetch('/api/analytics/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: payload,
        keepalive: true,
    }).catch(() => undefined)
}
