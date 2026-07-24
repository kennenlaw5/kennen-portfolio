import React, {useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import {useAnalyticsPreferences} from 'Components/analytics/AnalyticsPreferencesContext'
import {trackPageView} from 'JS/analytics'
import {isCanonicalPagePath} from 'JS/analytics/contracts'

const PageViewTracker: React.FC = () => {
    const {pathname} = useLocation()
    const {
        isAvailable,
        preference,
        privacySignalActive,
    } = useAnalyticsPreferences()
    const hasEffectivePermission = isAvailable
        && preference === 'granted'
        && !privacySignalActive
    const observedPath = useRef(pathname)
    const hasTrackedObservedPath = useRef(false)

    useEffect(() => {
        if (observedPath.current !== pathname) {
            observedPath.current = pathname
            hasTrackedObservedPath.current = false
        }

        if (
            hasEffectivePermission
            && !hasTrackedObservedPath.current
            && isCanonicalPagePath(pathname)
        ) {
            trackPageView(pathname)
            hasTrackedObservedPath.current = true
        }
    }, [hasEffectivePermission, pathname])

    return null
}

export default PageViewTracker
