import React from 'react'
import {FaLinkedin} from 'react-icons/fa'

const Linkedin: React.FC = () => (
    <a
        href={window.APP_CONFIG.linkedin_url}
        className='link'
        target="_blank"
        rel="noopener noreferrer"
    >
        <FaLinkedin className="text-xl" />
    </a>
)

export default Linkedin
