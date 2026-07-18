import React, {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

const PageViewTracker: React.FC = () => {
    const {pathname} = useLocation()

    useEffect(() => {
        trackEvent(ANALYTICS_EVENTS.PAGE_VIEW)
    }, [pathname])

    return null
}

export default PageViewTracker
