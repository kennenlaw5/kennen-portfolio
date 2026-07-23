export const ANALYTICS_EVENT_NAMES = {
    CONTACT_LINK_CLICKED: 'contact_link_clicked',
    PAGE_VIEW: 'page_view',
    PROJECT_LINK_CLICKED: 'project_link_clicked',
    RESUME_DOWNLOAD_CLICKED: 'resume_download_clicked',
} as const

export const PROJECT_ANALYTICS_IDS = {
    A2Z_DIGITAL_RETAIL: 'a2z-digital-retail',
    A2Z_IN_STORE: 'a2z-in-store',
    AKIDO_LABS: 'akido-labs',
    AMAZON_AUTOS: 'amazon-autos',
    ENGRAIN: 'engrain',
} as const

type TAnalyticsEventName = typeof ANALYTICS_EVENT_NAMES[keyof typeof ANALYTICS_EVENT_NAMES]
type TCanonicalPagePath = '/' | '/contact' | '/experience' | '/games'
type TContactMethod = 'email' | 'github' | 'linkedin' | 'location' | 'phone'
type TProjectAnalyticsId = typeof PROJECT_ANALYTICS_IDS[keyof typeof PROJECT_ANALYTICS_IDS]
type TResumePlacement = 'experience' | 'home'

type TPageViewEvent = {
    name: typeof ANALYTICS_EVENT_NAMES.PAGE_VIEW
    parameters: {
        page_path: TCanonicalPagePath
    }
}

type TContactLinkClickedEvent = {
    name: typeof ANALYTICS_EVENT_NAMES.CONTACT_LINK_CLICKED
    parameters: {
        contact_method: TContactMethod
    }
}

type TProjectLinkClickedEvent = {
    name: typeof ANALYTICS_EVENT_NAMES.PROJECT_LINK_CLICKED
    parameters: {
        project_id: TProjectAnalyticsId
    }
}

type TResumeDownloadClickedEvent = {
    name: typeof ANALYTICS_EVENT_NAMES.RESUME_DOWNLOAD_CLICKED
    parameters: {
        placement: TResumePlacement
    }
}

export type TAnalyticsEvent =
    | TPageViewEvent
    | TContactLinkClickedEvent
    | TProjectLinkClickedEvent
    | TResumeDownloadClickedEvent

export type {TAnalyticsEventName}
