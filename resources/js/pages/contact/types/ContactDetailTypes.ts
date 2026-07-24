import {IconType} from 'react-icons'
import {TContactMethod} from 'JS/analytics/contracts'

export type TContactDetail = {
    analyticsMethod: TContactMethod
    icon: IconType
    text: string
    link: string
}
