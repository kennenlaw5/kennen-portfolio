import React from 'react'
import {TContactDetail} from 'JS/pages/contact/types/ContactDetailTypes'

type TContactDetailProps = {
    item: TContactDetail
}
const ContactDetail: React.FC<TContactDetailProps> = ({item}) => (
    <li className="flex items-center">
        <span className="text-blue-500">{<item.icon />}</span>
        <a href={item.link} className="link ml-3 text-gray-700" target="_blank" rel="noopener noreferrer">
            {item.text}
        </a>
    </li>
)

export default ContactDetail
