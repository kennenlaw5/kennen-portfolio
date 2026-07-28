import React from 'react'
import classNames from 'classnames'
import {TAnalyticsPreference} from 'JS/analytics/engine'
import {
    PRIVACY_SIGNAL_DESCRIPTION_ID,
} from 'Components/analytics/AnalyticsConsentContent'
import styles from 'Sass/modules/AnalyticsConsent.module.scss'

type TAnalyticsConsentActionsProps = {
    closePreferences: () => void
    isInteractive: boolean
    privacySignalActive: boolean
    setPreference: (preference: TAnalyticsPreference) => boolean
    showClose: boolean
}

const AnalyticsConsentActions: React.FC<
    TAnalyticsConsentActionsProps
> = ({
    closePreferences,
    isInteractive,
    privacySignalActive,
    setPreference,
    showClose,
}) => (
    <div className="flex flex-col gap-3 sm:flex-row">
        <button
            aria-describedby={privacySignalActive
                ? PRIVACY_SIGNAL_DESCRIPTION_ID
                : undefined}
            aria-disabled={privacySignalActive || undefined}
            className={classNames(
                styles.analyticsConsentButton,
                styles.analyticsConsentButtonPrimary,
            )}
            onClick={() => setPreference('granted')}
            tabIndex={isInteractive ? undefined : -1}
            type="button"
        >
            Allow analytics
        </button>
        <button
            className={classNames(
                styles.analyticsConsentButton,
                styles.analyticsConsentButtonPrimary,
            )}
            onClick={() => setPreference('denied')}
            tabIndex={isInteractive ? undefined : -1}
            type="button"
        >
            No thanks
        </button>
        {showClose && (
            <button
                className={classNames(
                    styles.analyticsConsentButton,
                    styles.analyticsConsentButtonSecondary,
                )}
                onClick={closePreferences}
                tabIndex={isInteractive ? undefined : -1}
                type="button"
            >
                Close
            </button>
        )}
    </div>
)

export default AnalyticsConsentActions
