import React from 'react'
import {FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhone} from 'react-icons/fa'
import {TContactDetail} from 'JS/pages/contact/types/ContactDetailTypes'
import ContactDetail from 'JS/pages/contact/sections/ContactDetail'

const ContactDetails: React.FC = () => {
    const {
        phone,
        email,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        city,
        state_abbreviation: stateAbbreviation,
    } = window.APP_CONFIG

    const contactInfo: TContactDetail[] = [
        {
            icon: FaPhone,
            text: phone,
            link: `tel:${phone}`
        },
        {
            icon: FaEnvelope,
            text: email,
            link: `mailto:${email}`
        },
        {
            icon: FaLinkedin,
            text: 'LinkedIn Profile',
            link: linkedinUrl
        },
        {
            icon: FaGithub,
            text: 'GitHub Profile',
            link: githubUrl
        },
        {
            icon: FaMapMarkerAlt,
            text: `${city}, ${stateAbbreviation}`,
            link: `https://www.google.com/maps/place/${city}+${stateAbbreviation}`
        },
    ]

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Contact Details</h3>
            <ul className="space-y-4">
                {contactInfo.map((item, index) => <ContactDetail key={index} item={item} />)}
            </ul>
        </div>
    )
}

export default ContactDetails
