import React from 'react'
import {TContactDetail} from 'JS/pages/contact/types/ContactDetailTypes'
import {trackContactLinkClicked} from 'JS/analytics'

type TContactDetailProps = {
    item: TContactDetail
}
const ContactDetail: React.FC<TContactDetailProps> = ({item}) => (
    <li className="flex items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            {<item.icon aria-hidden="true" />}
        </span>
        <a
            href={item.link}
            className="link ml-4 break-all text-slate-200"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactLinkClicked(item.analyticsMethod)}
        >
            {item.text}
        </a>
    </li>
)

export default ContactDetail
