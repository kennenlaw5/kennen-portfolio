import {
    useCallback,
    useLayoutEffect,
    useState,
} from 'react'
import {
    getAnalyticsConsentFocusAction,
} from 'Components/analytics/analyticsConsentFocus'
import {
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'
import {
    ANALYTICS_CONSENT_PHASES,
    TAnalyticsConsentPhase,
} from 'Components/analytics/analyticsConsentPhase'

type TAnalyticsConsentFocusOptions = {
    panel: HTMLElement | null
    panelHeight: number
    phase: TAnalyticsConsentPhase
}

const useAnalyticsConsentFocus = ({
    panel,
    panelHeight,
    phase,
}: TAnalyticsConsentFocusOptions) => {
    const {
        consumeSynchronizedFocus,
        isOpen,
        shouldFocusHeading,
        synchronizedFocusRequest,
    } = useAnalyticsPreferences()
    const [heading, setHeading] = useState<HTMLHeadingElement | null>(null)
    const registerHeading = useCallback((
        element: HTMLHeadingElement | null,
    ): void => {
        setHeading(element)
    }, [])

    useLayoutEffect(() => {
        if (
            phase === ANALYTICS_CONSENT_PHASES.OPEN
            && isOpen
            && shouldFocusHeading
        ) {
            heading?.focus({preventScroll: true})
        }
    }, [heading, isOpen, phase, shouldFocusHeading])

    useLayoutEffect(() => {
        if (synchronizedFocusRequest === null) {
            return
        }

        const action = getAnalyticsConsentFocusAction({
            isOpen,
            panel,
            panelHeight,
            phase,
            target: synchronizedFocusRequest.target,
        })

        if (action === 'wait') {
            return
        }

        if (action === 'focus-main') {
            document.querySelector<HTMLElement>('main')
                ?.focus({preventScroll: true})
        } else if (action === 'focus-heading') {
            heading?.focus({preventScroll: true})
        }

        consumeSynchronizedFocus(synchronizedFocusRequest)
    }, [
        consumeSynchronizedFocus,
        heading,
        isOpen,
        panel,
        panelHeight,
        phase,
        synchronizedFocusRequest,
    ])

    return registerHeading
}

export default useAnalyticsConsentFocus
