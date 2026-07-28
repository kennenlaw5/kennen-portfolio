import React, {CSSProperties, ReactNode} from 'react'
import classNames from 'classnames'
import {
    useAnalyticsConsentLayout,
} from 'Components/analytics/AnalyticsConsentLayoutContext'
import {
    ANALYTICS_CONSENT_PHASES,
} from 'Components/analytics/analyticsConsentPhase'
import styles from 'Sass/modules/AnalyticsConsent.module.scss'

type TAnalyticsConsentPageProps = {
    children: ReactNode
}

const AnalyticsConsentPage: React.FC<TAnalyticsConsentPageProps> = ({
    children,
}) => {
    const {panelHeight, phase} = useAnalyticsConsentLayout()

    return (
        <div
            className={classNames(
                {
                    [styles.analyticsConsentPageOpening]:
                        phase === ANALYTICS_CONSENT_PHASES.OPENING,
                    '[overflow-anchor:none]':
                        phase === ANALYTICS_CONSENT_PHASES.OPENING,
                },
                'flex flex-1 flex-col',
            )}
            data-testid="analytics-consent-page"
            style={{
                '--analytics-consent-panel-height': `${panelHeight}px`,
            } as CSSProperties}
        >
            {children}
        </div>
    )
}

export default AnalyticsConsentPage
