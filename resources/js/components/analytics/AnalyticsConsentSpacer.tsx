import React from 'react'
import classNames from 'classnames'
import {
    useAnalyticsConsentLayout,
} from 'Components/analytics/AnalyticsConsentLayoutContext'
import {
    ANALYTICS_CONSENT_PHASES,
} from 'Components/analytics/analyticsConsentPhase'
import {
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'
import styles from 'Sass/modules/AnalyticsConsent.module.scss'

const AnalyticsConsentSpacer: React.FC = () => {
    const {panelHeight, phase, spacer} = useAnalyticsConsentLayout()
    const {isAvailable} = useAnalyticsPreferences()

    if (!isAvailable) {
        return null
    }

    return (
        <div
            aria-hidden="true"
            className={classNames(
                {
                    [styles.analyticsConsentSpacerClosing]:
                        phase === ANALYTICS_CONSENT_PHASES.CLOSING,
                },
                'shrink-0',
            )}
            data-testid="analytics-consent-spacer"
            ref={spacer}
            style={{
                height:
                    phase === ANALYTICS_CONSENT_PHASES.OPENING
                    || phase === ANALYTICS_CONSENT_PHASES.OPEN
                    ? panelHeight
                    : 0,
            }}
        />
    )
}

export default AnalyticsConsentSpacer
