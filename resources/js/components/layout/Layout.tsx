import React from 'react'
import {Outlet} from 'react-router-dom'
import Footer from 'Components/layout/Footer'
import PageViewTracker from 'Components/analytics/PageViewTracker'
import AnalyticsConsent from 'Components/analytics/AnalyticsConsent'
import {
    AnalyticsPreferencesProvider,
} from 'Components/analytics/AnalyticsPreferencesContext'
import Header from './Header'

const Layout = () => (
    <AnalyticsPreferencesProvider>
        <div className="flex flex-col min-h-screen">
            <PageViewTracker />
            <Header />
            <AnalyticsConsent />
            <main
                className="container mx-auto mt-6 flex-grow px-4"
                tabIndex={-1}
            >
                <Outlet />
            </main>
            <Footer />
        </div>
    </AnalyticsPreferencesProvider>
)

export default Layout
