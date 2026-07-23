import {describe, expect, it} from 'vitest'
import {parseAnalyticsRuntimeConfig} from 'JS/analytics/runtimeConfig'

describe('analytics runtime configuration', () => {
    it.each([
        ['missing', undefined],
        ['null', null],
        ['disabled', {enabled: false, measurement_id: 'G-TEST1234'}],
        ['missing measurement ID', {enabled: true}],
        ['legacy measurement ID', {enabled: true, measurement_id: 'UA-1234'}],
        ['lowercase measurement ID', {enabled: true, measurement_id: 'g-test1234'}],
        ['measurement ID with whitespace', {enabled: true, measurement_id: ' G-TEST1234'}],
    ])('fails closed for %s configuration', (_description, config) => {
        expect(parseAnalyticsRuntimeConfig(config)).toBeNull()
    })

    it('accepts an explicitly enabled GA4 measurement ID', () => {
        expect(parseAnalyticsRuntimeConfig({
            enabled: true,
            measurement_id: 'G-TEST1234',
        })).toEqual({
            enabled: true,
            measurement_id: 'G-TEST1234',
        })
    })
})
