import React from 'react'
import {FaLinkedin} from 'react-icons/fa'

const Linkedin: React.FC = () => (
    <a
        href={window.APP_CONFIG.linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-500 transition"
    >
        <FaLinkedin className="text-xl" />
    </a>
)

export default Linkedin
