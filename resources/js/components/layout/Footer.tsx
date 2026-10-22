import React from 'react'
import Linkedin from 'Components/contact/Linkedin'
import Email from 'Components/contact/Email'
import {
    useAnalyticsPreferences,
} from 'Components/analytics/AnalyticsPreferencesContext'

const Footer: React.FC = () => {
    const {
        isAvailable,
        isOpen,
        openPreferences,
        shouldFocusPreferences,
    } = useAnalyticsPreferences()

    return (
        <footer className="mt-8 border-t border-white/10 bg-slate-950/60 py-6 text-sm text-slate-400 backdrop-blur">
            <div className="container mx-auto text-center">
                <div className='flex justify-center items-center space-x-4 mt-2 text-slate-300'>
                    <Email />
                    <span className='cursor-default select-none text-slate-600'>|</span>
                    <Linkedin />
                </div>
                {isAvailable && (!isOpen || shouldFocusPreferences) && (
                    <button
                        className="mt-3 underline decoration-slate-600 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        onClick={(event) => openPreferences(
                            event.currentTarget,
                        )}
                        type="button"
                    >
                        Analytics preferences
                    </button>
                )}
                <p className="mt-3">&copy; {(new Date()).getFullYear()} Kennen Lawrence. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
