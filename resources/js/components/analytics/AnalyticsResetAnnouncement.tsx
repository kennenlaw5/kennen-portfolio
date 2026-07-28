import React, {useLayoutEffect, useState} from 'react'
import {
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'

const RESET_ANNOUNCEMENT =
    'Analytics preferences were reset in another tab. '
    + 'Review the available choices.'

const AnalyticsResetAnnouncement: React.FC = () => {
    const {
        isOpen,
        synchronizedFocusRequest,
    } = useAnalyticsPreferences()
    const [announcement, setAnnouncement] = useState('')
    const [pending, setPending] = useState(false)

    useLayoutEffect(() => {
        if (!isOpen) {
            setAnnouncement('')
            setPending(false)

            return
        }

        if (
            synchronizedFocusRequest !== null
            && announcement === ''
            && !pending
        ) {
            if (document.visibilityState === 'visible') {
                setAnnouncement(RESET_ANNOUNCEMENT)
            } else {
                setPending(true)
            }
        }
    }, [
        announcement,
        isOpen,
        pending,
        synchronizedFocusRequest,
    ])

    useLayoutEffect(() => {
        const announceWhenVisible = (): void => {
            if (
                document.visibilityState === 'visible'
                && isOpen
                && pending
            ) {
                setAnnouncement(RESET_ANNOUNCEMENT)
                setPending(false)
            }
        }

        document.addEventListener(
            'visibilitychange',
            announceWhenVisible,
        )
        announceWhenVisible()

        return () => {
            document.removeEventListener(
                'visibilitychange',
                announceWhenVisible,
            )
        }
    }, [isOpen, pending])

    return (
        <span
            aria-atomic="true"
            aria-live="polite"
            className="sr-only"
        >
            {announcement}
        </span>
    )
}

export default AnalyticsResetAnnouncement
