import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    TAnalyticsPreference,
} from 'JS/analytics/engine'
import {getAnalyticsEngine} from 'JS/analytics'
import {parseAnalyticsRuntimeConfig} from 'JS/analytics/runtimeConfig'

type TAnalyticsPreferencesContext = {
    isAvailable: boolean
    isOpen: boolean
    preference: TAnalyticsPreference | null
    failedPreference: TAnalyticsPreference | null
    privacySignalActive: boolean
    shouldFocusPreferences: boolean
    openPreferences: (opener?: HTMLElement) => void
    closePreferences: () => void
    setPreference: (preference: TAnalyticsPreference) => boolean
}

type TAnalyticsPreferencesProviderProps = {
    children: ReactNode
}

type TAnalyticsPreferencesState = {
    isOpen: boolean
    preference: TAnalyticsPreference | null
    failedPreference: TAnalyticsPreference | null
    shouldFocusPreferences: boolean
}

const defaultContext: TAnalyticsPreferencesContext = {
    isAvailable: false,
    isOpen: false,
    preference: null,
    failedPreference: null,
    privacySignalActive: false,
    shouldFocusPreferences: false,
    openPreferences: () => undefined,
    closePreferences: () => undefined,
    setPreference: () => false,
}

const AnalyticsPreferencesContext = createContext(defaultContext)

export const AnalyticsPreferencesProvider: React.FC<
    TAnalyticsPreferencesProviderProps
> = ({children}) => {
    const engine = useMemo(getAnalyticsEngine, [])
    const returnFocusElement = useRef<HTMLElement | null>(null)
    const focusMainAfterChoice = useRef(false)
    const isAvailable = parseAnalyticsRuntimeConfig(
        window.APP_CONFIG.analytics,
    ) !== null
    const privacySignalActive = navigator.doNotTrack === '1'
        || navigator.globalPrivacyControl === true
    const [state, setState] = useState<TAnalyticsPreferencesState>(() => {
        const preference = engine.getPreference()

        return {
            isOpen: isAvailable && preference === null,
            preference,
            failedPreference: null,
            shouldFocusPreferences: false,
        }
    })

    useEffect(() => {
        if (isAvailable) {
            engine.initialize()
        }
    }, [engine, isAvailable])

    useEffect(() => {
        if (state.isOpen) {
            return
        }

        if (returnFocusElement.current !== null) {
            returnFocusElement.current.focus()
            returnFocusElement.current = null
        } else if (focusMainAfterChoice.current) {
            document.querySelector<HTMLElement>('main')?.focus()
            focusMainAfterChoice.current = false
        }
    }, [state.isOpen])

    const openPreferences = (opener?: HTMLElement): void => {
        if (!isAvailable || state.isOpen || state.preference === null) {
            return
        }

        returnFocusElement.current = opener ?? null
        setState((currentState) => ({
            ...currentState,
            isOpen: true,
            failedPreference: null,
            shouldFocusPreferences: opener !== undefined,
        }))
    }

    const closePreferences = (): void => {
        setState((currentState) => {
            if (!currentState.shouldFocusPreferences) {
                return currentState
            }

            return {
                ...currentState,
                isOpen: false,
                failedPreference: null,
            }
        })
    }

    const setPreference = (
        preference: TAnalyticsPreference,
    ): boolean => {
        if (!isAvailable
            || (preference === 'granted' && privacySignalActive)
        ) {
            return false
        }

        const stored = engine.setPreference(preference)

        if (stored && returnFocusElement.current === null) {
            focusMainAfterChoice.current = true
        }

        setState((currentState) => ({
            isOpen: !stored,
            preference: engine.getPreference(),
            failedPreference: stored ? null : preference,
            shouldFocusPreferences: currentState.shouldFocusPreferences,
        }))

        return stored
    }

    return (
        <AnalyticsPreferencesContext.Provider value={{
            isAvailable,
            isOpen: state.isOpen,
            preference: state.preference,
            failedPreference: state.failedPreference,
            privacySignalActive,
            shouldFocusPreferences: state.shouldFocusPreferences,
            openPreferences,
            closePreferences,
            setPreference,
        }}>
            {children}
        </AnalyticsPreferencesContext.Provider>
    )
}

export const useAnalyticsPreferences = (): TAnalyticsPreferencesContext => (
    useContext(AnalyticsPreferencesContext)
)
