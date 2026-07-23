export type TPublicAnalyticsConfig = {
    enabled: boolean
    measurement_id: string
}

export type AppConfig = {
    phone: string
    email: string
    linkedin_url: string
    github_url: string
    city: string
    state_abbreviation: string
    analytics: TPublicAnalyticsConfig
}

declare global {
    interface Navigator {
        globalPrivacyControl?: boolean
    }

    interface Window {
        APP_CONFIG: AppConfig
        dataLayer?: unknown[]
        gtag?: (...args: [string, ...unknown[]]) => void
    }
}
export {}
