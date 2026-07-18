import React from 'react'
import {FaLinkedin} from 'react-icons/fa'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

const Linkedin: React.FC = () => (
    <a
        href={window.APP_CONFIG.linkedin_url}
        className='link'
        aria-label="Kennen Lawrence on LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent(ANALYTICS_EVENTS.CONTACT_LINK_CLICKED, {label: 'linkedin'})}
    >
        <FaLinkedin className="text-xl" aria-hidden="true" />
    </a>
)

export default Linkedin
