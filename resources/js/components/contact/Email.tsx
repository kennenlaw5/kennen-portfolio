import React from 'react'
import {FaEnvelope} from 'react-icons/fa'

const Email: React.FC = () => (
    <a href={`mailto:${window.APP_CONFIG.email}`} className="hover:text-blue-500 transition">
        <FaEnvelope className="text-xl" />
    </a>
)

export default Email
