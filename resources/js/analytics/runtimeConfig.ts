import {TPublicAnalyticsConfig} from 'JS/types/globals'

const GA4_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/

const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null
)

export const parseAnalyticsRuntimeConfig = (
    value: unknown,
): TPublicAnalyticsConfig | null => {
    if (!isRecord(value)
        || value.enabled !== true
        || typeof value.measurement_id !== 'string'
        || !GA4_MEASUREMENT_ID_PATTERN.test(value.measurement_id)
    ) {
        return null
    }

    return {
        enabled: true,
        measurement_id: value.measurement_id,
    }
}
