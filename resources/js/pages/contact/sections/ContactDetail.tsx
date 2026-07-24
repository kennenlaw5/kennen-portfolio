import React from 'react'
import {TContactDetail} from 'JS/pages/contact/types/ContactDetailTypes'
import {trackContactLinkClicked} from 'JS/analytics'

type TContactDetailProps = {
    item: TContactDetail
}
const ContactDetail: React.FC<TContactDetailProps> = ({item}) => (
    <li className="flex items-center">
        <span className="text-blue-500">{<item.icon aria-hidden="true" />}</span>
        <a
            href={item.link}
            className="link ml-3 text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactLinkClicked(item.analyticsMethod)}
        >
            {item.text}
        </a>
    </li>
)

export default ContactDetail
