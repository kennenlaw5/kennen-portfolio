import React from 'react'
import classNames from 'classnames'
import AnalyticsConsentActions
    from 'Components/analytics/AnalyticsConsentActions'
import AnalyticsConsentContent, {
    ANALYTICS_CONSENT_HEADING_ID,
} from 'Components/analytics/AnalyticsConsentContent'
import {
    ANALYTICS_CONSENT_PHASES,
} from 'Components/analytics/analyticsConsentPhase'
import {
    useAnalyticsConsentLayout,
} from 'Components/analytics/AnalyticsConsentLayoutContext'
import {
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'
import styles from 'Sass/modules/AnalyticsConsent.module.scss'

const AnalyticsConsent: React.FC = () => {
    const {
        completeTransition,
        phase,
        registerHeading,
        registerPanel,
    } = useAnalyticsConsentLayout()
    const {
        closePreferences,
        failedPreference,
        isAvailable,
        preference,
        privacySignalActive,
        setPreference,
        shouldFocusPreferences,
    } = useAnalyticsPreferences()
    const isHidden =
        phase === ANALYTICS_CONSENT_PHASES.CLOSED
        || phase === ANALYTICS_CONSENT_PHASES.CLOSING

    const finishTransition = (
        event: React.TransitionEvent<HTMLElement>,
    ): void => {
        if (
            event.currentTarget === event.target
            && event.propertyName === 'transform'
        ) {
            completeTransition()
        }
    }

    if (!isAvailable) {
        return null
    }

    return (
        <section
            aria-hidden={isHidden || undefined}
            aria-labelledby={ANALYTICS_CONSENT_HEADING_ID}
            className={classNames(
                styles.analyticsConsentPanel,
                {
                    [styles.analyticsConsentPanelClosed]:
                        phase === ANALYTICS_CONSENT_PHASES.CLOSED,
                    [styles.analyticsConsentPanelOpening]:
                        phase === ANALYTICS_CONSENT_PHASES.OPENING,
                    [styles.analyticsConsentPanelClosing]:
                        phase === ANALYTICS_CONSENT_PHASES.CLOSING,
                },
                'fixed inset-x-0 bottom-0 z-40 overflow-y-auto',
                'border-t border-gray-300',
                'bg-white pb-[env(safe-area-inset-bottom)] shadow-lg',
            )}
            data-testid="analytics-consent-panel"
            inert={isHidden || undefined}
            onTransitionEnd={finishTransition}
            ref={registerPanel}
            role="region"
        >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-5 sm:px-6">
                <AnalyticsConsentContent
                    failedPreference={failedPreference}
                    preference={preference}
                    privacySignalActive={privacySignalActive}
                    registerHeading={registerHeading}
                />
                <AnalyticsConsentActions
                    closePreferences={closePreferences}
                    isInteractive={
                        phase === ANALYTICS_CONSENT_PHASES.OPEN
                    }
                    privacySignalActive={privacySignalActive}
                    setPreference={setPreference}
                    showClose={
                        shouldFocusPreferences
                        || (
                            phase === ANALYTICS_CONSENT_PHASES.CLOSED
                            && preference !== null
                        )
                    }
                />
            </div>
        </section>
    )
}

export default AnalyticsConsent
