import React from 'react'
import {FaEnvelope} from 'react-icons/fa'
import {trackContactLinkClicked} from 'JS/analytics'

const Email: React.FC = () => (
    <a
        href={`mailto:${window.APP_CONFIG.email}`}
        className='link'
        aria-label="Email Kennen Lawrence"
        onClick={() => trackContactLinkClicked('email')}
    >
        <FaEnvelope className="text-xl" aria-hidden="true" />
    </a>
)

export default Email
