import React, {
    createContext,
    ReactNode,
    useContext,
    useRef,
} from 'react'
import AnalyticsResetAnnouncement
    from 'Components/analytics/AnalyticsResetAnnouncement'
import {
    TAnalyticsConsentPhase,
} from 'Components/analytics/analyticsConsentPhase'
import useAnalyticsConsentDrawer
    from 'Components/analytics/useAnalyticsConsentDrawer'
import useAnalyticsConsentFocus
    from 'Components/analytics/useAnalyticsConsentFocus'

type TAnalyticsConsentLayoutContext = {
    completeTransition: () => void
    panelHeight: number
    phase: TAnalyticsConsentPhase
    registerHeading: (element: HTMLHeadingElement | null) => void
    registerPanel: (element: HTMLElement | null) => void
    spacer: React.RefObject<HTMLDivElement | null>
}

type TAnalyticsConsentLayoutProviderProps = {
    children: ReactNode
}

const AnalyticsConsentLayoutContext = createContext<
    TAnalyticsConsentLayoutContext | null
>(null)

export const AnalyticsConsentLayoutProvider: React.FC<
    TAnalyticsConsentLayoutProviderProps
> = ({children}) => {
    const spacer = useRef<HTMLDivElement>(null)
    const {
        completeTransition,
        panel,
        panelHeight,
        phase,
        registerPanel,
    } = useAnalyticsConsentDrawer(spacer)
    const registerHeading = useAnalyticsConsentFocus({
        panel,
        panelHeight,
        phase,
    })

    return (
        <AnalyticsConsentLayoutContext.Provider value={{
            completeTransition,
            panelHeight,
            phase,
            registerHeading,
            registerPanel,
            spacer,
        }}>
            <AnalyticsResetAnnouncement />
            {children}
        </AnalyticsConsentLayoutContext.Provider>
    )
}

export const useAnalyticsConsentLayout =
    (): TAnalyticsConsentLayoutContext => {
        const context = useContext(AnalyticsConsentLayoutContext)

        if (context === null) {
            throw new Error(
                'useAnalyticsConsentLayout must be used within '
                + 'AnalyticsConsentLayoutProvider',
            )
        }

        return context
    }
