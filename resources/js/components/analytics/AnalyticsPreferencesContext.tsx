import React, {
    createContext,
    ReactNode,
    useContext,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react'
import {
    ANALYTICS_PREFERENCE_KEY,
    TAnalyticsPreference,
} from 'JS/analytics/engine'
import {getAnalyticsEngine} from 'JS/analytics'
import {parseAnalyticsRuntimeConfig} from 'JS/analytics/runtimeConfig'

export type TAnalyticsSynchronizedFocusRequest = {
    target: HTMLElement | null
}

type TAnalyticsCloseRequest = {
    focusTarget: HTMLElement | null
}

type TAnalyticsPreferencesContext = {
    isAvailable: boolean
    isOpen: boolean
    preference: TAnalyticsPreference | null
    failedPreference: TAnalyticsPreference | null
    privacySignalActive: boolean
    shouldFocusHeading: boolean
    shouldFocusPreferences: boolean
    synchronizedFocusRequest:
        TAnalyticsSynchronizedFocusRequest | null
    consumeSynchronizedFocus: (
        request: TAnalyticsSynchronizedFocusRequest,
    ) => void
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
    shouldFocusHeading: boolean
    shouldFocusPreferences: boolean
    synchronizedFocusRequest:
        TAnalyticsSynchronizedFocusRequest | null
    returnFocusTarget: HTMLElement | null
    closeRequest: TAnalyticsCloseRequest | null
}

const defaultContext: TAnalyticsPreferencesContext = {
    isAvailable: false,
    isOpen: false,
    preference: null,
    failedPreference: null,
    privacySignalActive: false,
    shouldFocusHeading: false,
    shouldFocusPreferences: false,
    synchronizedFocusRequest: null,
    consumeSynchronizedFocus: () => undefined,
    openPreferences: () => undefined,
    closePreferences: () => undefined,
    setPreference: () => false,
}

const AnalyticsPreferencesContext = createContext(defaultContext)

export const AnalyticsPreferencesProvider: React.FC<
    TAnalyticsPreferencesProviderProps
> = ({children}) => {
    const engine = useMemo(getAnalyticsEngine, [])
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
        shouldFocusHeading: false,
        shouldFocusPreferences: false,
        synchronizedFocusRequest: null,
        returnFocusTarget: null,
        closeRequest: null,
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

            setState((currentState) => {
                if (
                    currentState.failedPreference !== null
                    || (
                        currentState.isSynchronized
                        && currentState.preference === preference
                    )
                ) {
                    return currentState
                }

                const shouldRestoreReopenFocus =
                    restoreFocusIfRemoved
                    && preference !== null
                    && currentState.isOpen
                    && currentState.shouldFocusPreferences

                return {
                    isOpen: preference === null,
                    isSynchronized: true,
                    preference,
                    failedPreference: null,
                    shouldFocusHeading: preference === null
                        && !restoreFocusIfRemoved,
                    shouldFocusPreferences:
                        preference !== null
                        && currentState.shouldFocusPreferences,
                    synchronizedFocusRequest:
                        restoreFocusIfRemoved
                        && !shouldRestoreReopenFocus
                        ? {target: activeElement}
                        : null,
                    returnFocusTarget: null,
                    closeRequest: shouldRestoreReopenFocus
                        ? {
                            focusTarget:
                                currentState.returnFocusTarget,
                        }
                        : null,
                }
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

    useLayoutEffect(() => {
        const closeRequest = state.closeRequest

        if (closeRequest === null) {
            return
        }

        const focusTarget = closeRequest.focusTarget?.isConnected
            ? closeRequest.focusTarget
            : document.querySelector<HTMLElement>('main')

        focusTarget?.focus({preventScroll: true})

        setState((currentState) => (
            currentState.closeRequest === closeRequest
                ? {
                    ...currentState,
                    closeRequest: null,
                    returnFocusTarget: null,
                }
                : currentState
        ))
    }, [state.closeRequest])

    const consumeSynchronizedFocus = (
        request: TAnalyticsSynchronizedFocusRequest,
    ): void => {
        setState((currentState) => (
            currentState.synchronizedFocusRequest === request
                ? {
                    ...currentState,
                    synchronizedFocusRequest: null,
                }
                : currentState
        ))
    }

    const openPreferences = (opener?: HTMLElement): void => {
        setState((currentState) => {
            if (
                !isAvailable
                || !currentState.isSynchronized
                || currentState.isOpen
                || currentState.preference === null
            ) {
                return currentState
            }

            return {
                ...currentState,
                isOpen: true,
                failedPreference: null,
                shouldFocusHeading: true,
                shouldFocusPreferences: opener !== undefined,
                synchronizedFocusRequest: null,
                returnFocusTarget: opener ?? null,
                closeRequest: null,
            }
        })
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
                shouldFocusHeading: false,
                synchronizedFocusRequest: null,
                closeRequest: {
                    focusTarget: currentState.returnFocusTarget,
                },
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

        setState((currentState) => ({
            ...currentState,
            isOpen: !stored,
            isSynchronized: true,
            preference: engine.getPreference(),
            failedPreference: stored ? null : preference,
            shouldFocusHeading: false,
            synchronizedFocusRequest: null,
            closeRequest: stored
                ? {
                    focusTarget: currentState.returnFocusTarget,
                }
                : null,
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
            shouldFocusHeading: state.shouldFocusHeading,
            shouldFocusPreferences: state.shouldFocusPreferences,
            synchronizedFocusRequest: state.synchronizedFocusRequest,
            consumeSynchronizedFocus,
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
