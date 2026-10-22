import React from 'react'
import {Outlet} from 'react-router'
import Footer from 'Components/layout/Footer'
import PageViewTracker from 'Components/analytics/PageViewTracker'
import AnalyticsConsent from 'Components/analytics/AnalyticsConsent'
import AnalyticsConsentPage from 'Components/analytics/AnalyticsConsentPage'
import AnalyticsConsentSpacer from 'Components/analytics/AnalyticsConsentSpacer'
import {
    AnalyticsConsentLayoutProvider,
} from 'Components/analytics/AnalyticsConsentLayoutContext'
import {
    AnalyticsPreferencesProvider,
} from 'Components/analytics/AnalyticsPreferencesContext'
import Backdrop from './Backdrop'
import Header from './Header'
import SpotlightTracker from './SpotlightTracker'

const Layout: React.FC = () => (
    <AnalyticsPreferencesProvider>
        <AnalyticsConsentLayoutProvider>
            <div className="flex min-h-screen flex-col">
                <Backdrop />
                <SpotlightTracker />
                <PageViewTracker />
                <Header />
                <AnalyticsConsent />
                <AnalyticsConsentPage>
                    <main
                        className="container mx-auto mt-6 flex-grow px-4"
                        tabIndex={-1}
                    >
                        <Outlet />
                    </main>
                    <Footer />
                </AnalyticsConsentPage>
                <AnalyticsConsentSpacer />
            </div>
        </AnalyticsConsentLayoutProvider>
    </AnalyticsPreferencesProvider>
)

export default Layout
