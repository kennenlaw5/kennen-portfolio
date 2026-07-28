import React from 'react'
import {TAnalyticsPreference} from 'JS/analytics/engine'

type TAnalyticsConsentContentProps = {
    failedPreference: TAnalyticsPreference | null
    preference: TAnalyticsPreference | null
    privacySignalActive: boolean
    registerHeading: (element: HTMLHeadingElement | null) => void
}

export const ANALYTICS_CONSENT_HEADING_ID =
    'analytics-preferences-heading'
export const PRIVACY_SIGNAL_DESCRIPTION_ID =
    'analytics-privacy-signal-description'

const AnalyticsConsentContent: React.FC<
    TAnalyticsConsentContentProps
> = ({
    failedPreference,
    preference,
    privacySignalActive,
    registerHeading,
}) => (
    <div>
        <h2
            className="mb-2 text-2xl"
            id={ANALYTICS_CONSENT_HEADING_ID}
            ref={registerHeading}
            tabIndex={-1}
        >
            Analytics preferences
        </h2>
        <p className="mb-2">
            With your permission, Google Analytics will collect limited
            usage data, such as the pages you visit and certain links
            you click, to help me improve this site.
        </p>
        <p className="mb-0">
            Your choice is stored only in this browser. These analytics
            events do not include contact details or other information
            that directly identifies you.
        </p>
        {preference === 'granted' && (
            <p className="mb-0 mt-2">
                Selecting No thanks turns off analytics for future
                activity. It does not delete information Google may
                already retain.
            </p>
        )}
        {privacySignalActive && (
            <p
                className="mb-0 mt-2 border-l-4 border-blue-500 bg-blue-50 px-3 py-2"
                id={PRIVACY_SIGNAL_DESCRIPTION_ID}
            >
                A browser privacy signal keeps analytics disabled.
                Your saved preference is not changed.
            </p>
        )}
        <div role="status">
            {failedPreference !== null && (
                <p className="mb-0 mt-2 border-l-4 border-red-500 bg-red-50 px-3 py-2">
                    This browser could not save your choice. Analytics
                    is off for this page. {
                        failedPreference === 'denied'
                            ? 'Please try No thanks again to keep it off after you reload.'
                            : 'Please try Allow analytics again if you want to enable it after you reload.'
                    }
                </p>
            )}
        </div>
    </div>
)

export default AnalyticsConsentContent
