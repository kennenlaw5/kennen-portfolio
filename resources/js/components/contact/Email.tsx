import React from 'react'
import {FaEnvelope} from 'react-icons/fa'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

const Email: React.FC = () => (
    <a
        href={`mailto:${window.APP_CONFIG.email}`}
        className='link'
        aria-label="Email Kennen Lawrence"
        onClick={() => trackEvent(ANALYTICS_EVENTS.CONTACT_LINK_CLICKED, {label: 'email'})}
    >
        <FaEnvelope className="text-xl" aria-hidden="true" />
    </a>
)

export default Email
