import {
    RefObject,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import {
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'
import {
    ANALYTICS_CONSENT_PHASES,
    TAnalyticsConsentPhase,
} from 'Components/analytics/analyticsConsentPhase'
import useAnalyticsConsentPhase
    from 'Components/analytics/useAnalyticsConsentPhase'
import useElementHeight from 'Components/analytics/useElementHeight'
import useReducedMotion from 'Components/analytics/useReducedMotion'

type TAnalyticsConsentDrawer = {
    completeTransition: () => void
    panel: HTMLElement | null
    panelHeight: number
    phase: TAnalyticsConsentPhase
    registerPanel: (element: HTMLElement | null) => void
}

const useAnalyticsConsentDrawer = (
    spacer: RefObject<HTMLDivElement | null>,
): TAnalyticsConsentDrawer => {
    const {isAvailable, isOpen, shouldFocusPreferences} =
        useAnalyticsPreferences()
    const reducedMotion = useReducedMotion()
    const [panel, setPanel] = useState<HTMLElement | null>(null)
    const panelHeight = useElementHeight(panel, isAvailable)
    const {
        completeTransition,
        consumeOpenScroll,
        phase,
    } = useAnalyticsConsentPhase({
        isAvailable,
        isOpen,
        reducedMotion,
        shouldFocusPreferences,
    })
    const previousPhase = useRef(phase)

    const registerPanel = useCallback((
        element: HTMLElement | null,
    ): void => {
        setPanel(element)
    }, [])

    useLayoutEffect(() => {
        const wasOpen =
            previousPhase.current === ANALYTICS_CONSENT_PHASES.OPENING
            || previousPhase.current === ANALYTICS_CONSENT_PHASES.OPEN
        const isOpening =
            phase === ANALYTICS_CONSENT_PHASES.OPENING
            || phase === ANALYTICS_CONSENT_PHASES.OPEN

        if (
            !wasOpen
            && isOpening
            && panel !== null
        ) {
            panel.scrollTop = 0
        }

        previousPhase.current = phase
    }, [panel, phase])

    useLayoutEffect(() => {
        if (
            panelHeight <= 0
            || (
                phase !== ANALYTICS_CONSENT_PHASES.OPENING
                && phase !== ANALYTICS_CONSENT_PHASES.OPEN
            )
            || !consumeOpenScroll()
        ) {
            return
        }

        window.scrollTo({
            behavior: 'auto',
            top: document.documentElement.scrollHeight
                - (spacer.current?.getBoundingClientRect().height ?? 0)
                + panelHeight,
        })
    }, [
        consumeOpenScroll,
        panelHeight,
        phase,
        spacer,
    ])

    return {
        completeTransition,
        panel,
        panelHeight,
        phase,
        registerPanel,
    }
}

export default useAnalyticsConsentDrawer
