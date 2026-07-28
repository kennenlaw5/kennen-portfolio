export const ANALYTICS_CONSENT_PHASES = {
    CLOSED: 'closed',
    OPENING: 'opening',
    OPEN: 'open',
    CLOSING: 'closing',
} as const

export type TAnalyticsConsentPhase =
    typeof ANALYTICS_CONSENT_PHASES[
        keyof typeof ANALYTICS_CONSENT_PHASES
    ]
