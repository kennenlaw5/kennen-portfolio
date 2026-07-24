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
        <footer className="bg-gray-800 text-gray-300 py-4">
            <div className="container mx-auto text-center">
                <div className='flex justify-center items-center space-x-4 mt-2'>
                    <Email />
                    <span className='cursor-default select-none'>|</span>
                    <Linkedin />
                </div>
                {isAvailable && (!isOpen || shouldFocusPreferences) && (
                    <button
                        className="mt-2 text-sm underline decoration-gray-500 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                        onClick={(event) => openPreferences(
                            event.currentTarget,
                        )}
                        type="button"
                    >
                        Analytics preferences
                    </button>
                )}
                <p>&copy; {(new Date()).getFullYear()} Kennen Lawrence. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
