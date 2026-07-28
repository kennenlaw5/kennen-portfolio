import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import {
    ANALYTICS_CONSENT_PHASES,
    TAnalyticsConsentPhase,
} from 'Components/analytics/analyticsConsentPhase'

type TAnalyticsConsentPhaseOptions = {
    isAvailable: boolean
    isOpen: boolean
    reducedMotion: boolean
    shouldFocusPreferences: boolean
}

const DRAWER_TRANSITION_FALLBACK_MS = 350
const {
    CLOSED,
    CLOSING,
    OPEN,
    OPENING,
} = ANALYTICS_CONSENT_PHASES

const useAnalyticsConsentPhase = ({
    isAvailable,
    isOpen,
    reducedMotion,
    shouldFocusPreferences,
}: TAnalyticsConsentPhaseOptions) => {
    const [phase, setPhase] = useState<TAnalyticsConsentPhase>(CLOSED)
    const shouldScrollOnOpen = useRef(false)

    const completeTransition = useCallback((): void => {
        setPhase((currentPhase) => {
            if (currentPhase === OPENING) {
                return OPEN
            }

            return currentPhase === CLOSING
                ? CLOSED
                : currentPhase
        })
    }, [])

    const consumeOpenScroll = useCallback((): boolean => {
        if (!shouldScrollOnOpen.current) {
            return false
        }

        shouldScrollOnOpen.current = false

        return true
    }, [])

    useLayoutEffect(() => {
        if (!isAvailable) {
            shouldScrollOnOpen.current = false
            setPhase(CLOSED)

            return
        }

        if (isOpen && (phase === CLOSED || phase === CLOSING)) {
            shouldScrollOnOpen.current = shouldFocusPreferences
            setPhase(
                shouldFocusPreferences && !reducedMotion
                    ? OPENING
                    : OPEN,
            )
        } else if (!isOpen && (phase === OPENING || phase === OPEN)) {
            shouldScrollOnOpen.current = false
            setPhase(reducedMotion ? CLOSED : CLOSING)
        }
    }, [
        isAvailable,
        isOpen,
        phase,
        reducedMotion,
        shouldFocusPreferences,
    ])

    useLayoutEffect(() => {
        if (reducedMotion && phase === OPENING) {
            setPhase(OPEN)
        } else if (reducedMotion && phase === CLOSING) {
            setPhase(CLOSED)
        }
    }, [phase, reducedMotion])

    useLayoutEffect(() => {
        if (phase !== OPENING && phase !== CLOSING) {
            return
        }

        const timeout = window.setTimeout(
            completeTransition,
            DRAWER_TRANSITION_FALLBACK_MS,
        )

        return () => {
            window.clearTimeout(timeout)
        }
    }, [completeTransition, phase])

    return {completeTransition, consumeOpenScroll, phase}
}

export default useAnalyticsConsentPhase
