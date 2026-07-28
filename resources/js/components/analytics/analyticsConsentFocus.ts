import {
    ANALYTICS_CONSENT_PHASES,
    TAnalyticsConsentPhase,
} from 'Components/analytics/analyticsConsentPhase'

export type TAnalyticsConsentFocusAction =
    'consume' | 'focus-heading' | 'focus-main' | 'wait'

type TAnalyticsConsentFocusOptions = {
    isOpen: boolean
    panel: HTMLElement | null
    panelHeight: number
    phase: TAnalyticsConsentPhase
    target: HTMLElement | null
}

const FOCUSABLE_PAGE_CONTROL_SELECTOR = [
    'a[href]',
    'button',
    'input',
    'select',
    'summary',
    'textarea',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
].join(', ')

const rectanglesOverlap = (first: DOMRect, second: DOMRect): boolean => (
    first.bottom > second.top
    && first.top < second.bottom
    && first.right > second.left
    && first.left < second.right
)

export const getAnalyticsConsentFocusAction = ({
    isOpen,
    panel,
    panelHeight,
    phase,
    target,
}: TAnalyticsConsentFocusOptions): TAnalyticsConsentFocusAction => {
    if (target === null) {
        return 'consume'
    }

    if (!target.isConnected) {
        return 'focus-main'
    }

    if (!isOpen) {
        return panel?.contains(target) ? 'focus-main' : 'consume'
    }

    if (
        panel?.contains(target)
        || !target.matches(FOCUSABLE_PAGE_CONTROL_SELECTOR)
    ) {
        return 'consume'
    }

    if (
        phase !== ANALYTICS_CONSENT_PHASES.OPEN
        || panel === null
        || panelHeight <= 0
    ) {
        return 'wait'
    }

    return rectanglesOverlap(
        target.getBoundingClientRect(),
        panel.getBoundingClientRect(),
    )
        ? 'focus-heading'
        : 'consume'
}
