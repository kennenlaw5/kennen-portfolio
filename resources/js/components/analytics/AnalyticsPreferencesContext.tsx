import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    ANALYTICS_PREFERENCE_KEY,
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
    isSynchronized: boolean
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

const shallowEqual = <T extends object>(left: T, right: T): boolean => (
    (Object.keys(left) as Array<keyof T>).every(
        (key) => left[key] === right[key],
    )
)

export const AnalyticsPreferencesProvider: React.FC<
    TAnalyticsPreferencesProviderProps
> = ({children}) => {
    const engine = useMemo(getAnalyticsEngine, [])
    const returnFocusElement = useRef<HTMLElement | null>(null)
    const focusMainAfterChoice = useRef(false)
    const synchronizedFocusElement = useRef<HTMLElement | null>(null)
    const isAvailable = parseAnalyticsRuntimeConfig(
        window.APP_CONFIG.analytics,
    ) !== null
    const privacySignalActive = navigator.doNotTrack === '1'
        || navigator.globalPrivacyControl === true
    const [state, setState] = useState<TAnalyticsPreferencesState>({
        isOpen: false,
        isSynchronized: false,
        preference: null,
        failedPreference: null,
        shouldFocusPreferences: false,
    })

    useLayoutEffect(() => {
        if (!isAvailable) {
            return
        }

        const synchronizePreferenceState = (
            storedPreference: string | null,
            restoreFocusIfRemoved: boolean,
        ): void => {
            const activeElement = restoreFocusIfRemoved
                && document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null
            const preference = engine.synchronizePreference(storedPreference)

            if (preference === null) {
                returnFocusElement.current = null
            }

            setState((currentState) => {
                if (currentState.failedPreference !== null) {
                    return currentState
                }

                const nextState: TAnalyticsPreferencesState = {
                    isOpen: preference === null,
                    isSynchronized: true,
                    preference,
                    failedPreference: null,
                    shouldFocusPreferences: false,
                }
                const stateChanged = !shallowEqual(
                    currentState,
                    nextState,
                )

                synchronizedFocusElement.current = stateChanged
                    ? activeElement
                    : null

                return stateChanged ? nextState : currentState
            })
        }

        let preferenceStorage: Storage

        try {
            preferenceStorage = window.localStorage
        } catch {
            engine.synchronizePreference(null)

            return
        }

        const synchronizeStoredPreference = (
            restoreFocusIfRemoved: boolean,
        ): void => {
            let storedPreference: string | null = null

            try {
                storedPreference = preferenceStorage.getItem(
                    ANALYTICS_PREFERENCE_KEY,
                )
            } catch {
                // An unreadable preference fails closed.
            }

            synchronizePreferenceState(
                storedPreference,
                restoreFocusIfRemoved,
            )
        }

        const synchronizePreference = (event: StorageEvent): void => {
            if (
                event.storageArea !== preferenceStorage
                || (
                    event.key !== ANALYTICS_PREFERENCE_KEY
                    && event.key !== null
                )
            ) {
                return
            }

            synchronizeStoredPreference(true)
        }

        window.addEventListener('storage', synchronizePreference)
        synchronizeStoredPreference(false)

        return () => {
            window.removeEventListener('storage', synchronizePreference)
        }
    }, [engine, isAvailable])

    useEffect(() => {
        const synchronizedElement = synchronizedFocusElement.current
        synchronizedFocusElement.current = null

        if (!state.isOpen && returnFocusElement.current !== null) {
            returnFocusElement.current.focus()
            returnFocusElement.current = null

            return
        }

        if (!state.isOpen && focusMainAfterChoice.current) {
            document.querySelector<HTMLElement>('main')?.focus()
            focusMainAfterChoice.current = false

            return
        }

        if (
            synchronizedElement !== null
            && !synchronizedElement.isConnected
        ) {
            document.querySelector<HTMLElement>('main')?.focus()
        }
    }, [
        state.isOpen,
        state.preference,
        state.shouldFocusPreferences,
    ])

    const openPreferences = (opener?: HTMLElement): void => {
        if (
            !isAvailable
            || !state.isSynchronized
            || state.isOpen
            || state.preference === null
        ) {
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
            || !state.isSynchronized
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
            isSynchronized: true,
            preference: engine.getPreference(),
            failedPreference: stored ? null : preference,
            shouldFocusPreferences: currentState.shouldFocusPreferences,
        }))

        return stored
    }

    return (
        <AnalyticsPreferencesContext.Provider value={{
            isAvailable: isAvailable && state.isSynchronized,
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
