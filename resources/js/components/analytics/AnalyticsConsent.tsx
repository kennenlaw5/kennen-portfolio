import React, {useEffect, useRef} from 'react'
import classNames from 'classnames'
import {
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'
import styles from 'Sass/modules/AnalyticsConsent.module.scss'

const HEADING_ID = 'analytics-preferences-heading'
const PRIVACY_SIGNAL_DESCRIPTION_ID = 'analytics-privacy-signal-description'

const AnalyticsConsent: React.FC = () => {
    const {
        isAvailable,
        isOpen,
        preference,
        failedPreference,
        privacySignalActive,
        closePreferences,
        setPreference,
        shouldFocusPreferences,
    } = useAnalyticsPreferences()
    const heading = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        if (isOpen && shouldFocusPreferences) {
            heading.current?.focus()
        }
    }, [isOpen, shouldFocusPreferences])

    if (!isAvailable || !isOpen) {
        return null
    }

    return (
        <section
            aria-labelledby={HEADING_ID}
            className="border-y border-gray-300 bg-white shadow-lg"
            role="region"
        >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-5 sm:px-6">
                <div>
                    <h2
                        className="mb-2 text-2xl"
                        id={HEADING_ID}
                        ref={heading}
                        tabIndex={shouldFocusPreferences ? -1 : undefined}
                    >
                        Analytics preferences
                    </h2>
                    <p className="mb-2">
                        Google Analytics helps me understand broad, directional
                        patterns across page visits and clicks on contact,
                        project, and resume links. I do not treat these signals
                        as exact human counts or proof that an action completed.
                    </p>
                    <p className="mb-0">
                        Your choice is stored only in this browser. No contact
                        details are included in these events.
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
                                This browser could not save your choice.
                                Analytics is off for this page. {
                                    failedPreference === 'denied'
                                        ? 'Please try No thanks again to keep it off after you reload.'
                                        : 'Please try Allow analytics again if you want to enable it after you reload.'
                                }
                            </p>
                        )}
                    </div>
                </div>
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
                        type="button"
                    >
                        No thanks
                    </button>
                    {shouldFocusPreferences && (
                        <button
                            className={classNames(
                                styles.analyticsConsentButton,
                                styles.analyticsConsentButtonSecondary,
                            )}
                            onClick={closePreferences}
                            type="button"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AnalyticsConsent
