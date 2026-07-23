import {describe, expect, it} from 'vitest'
import {
    ANALYTICS_EVENT_NAMES,
    PROJECT_ANALYTICS_IDS,
    type TAnalyticsEvent,
} from 'JS/analytics/contracts'

describe('analytics event contract', () => {
    it('is limited to closed event names and parameter values', () => {
        const supportedEvents: TAnalyticsEvent[] = [
            {
                name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
                parameters: {page_path: '/experience'},
            },
            {
                name: ANALYTICS_EVENT_NAMES.CONTACT_LINK_CLICKED,
                parameters: {contact_method: 'email'},
            },
            {
                name: ANALYTICS_EVENT_NAMES.PROJECT_LINK_CLICKED,
                parameters: {project_id: PROJECT_ANALYTICS_IDS.AMAZON_AUTOS},
            },
            {
                name: ANALYTICS_EVENT_NAMES.RESUME_DOWNLOAD_CLICKED,
                parameters: {placement: 'home'},
            },
        ]

        expect(supportedEvents.map(({name}) => name)).toEqual([
            'page_view',
            'contact_link_clicked',
            'project_link_clicked',
            'resume_download_clicked',
        ])
    })

    it('rejects free-form values at typecheck time', () => {
        const invalidContact: TAnalyticsEvent = {
            name: ANALYTICS_EVENT_NAMES.CONTACT_LINK_CLICKED,
            // @ts-expect-error Contact values are a closed vocabulary.
            parameters: {contact_method: 'public@example.test'},
        }
        const invalidProject: TAnalyticsEvent = {
            name: ANALYTICS_EVENT_NAMES.PROJECT_LINK_CLICKED,
            // @ts-expect-error Project URLs are not analytics identifiers.
            parameters: {project_id: 'https://example.test/project'},
        }
        const invalidPlacement: TAnalyticsEvent = {
            name: ANALYTICS_EVENT_NAMES.RESUME_DOWNLOAD_CLICKED,
            // @ts-expect-error Resume placement is a closed vocabulary.
            parameters: {placement: 'footer'},
        }
        const invalidPath: TAnalyticsEvent = {
            name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
            // @ts-expect-error Page paths must be canonical SPA routes.
            parameters: {page_path: '/experience?source=email'},
        }

        expect([
            invalidContact,
            invalidProject,
            invalidPlacement,
            invalidPath,
        ]).toHaveLength(4)
    })
})
