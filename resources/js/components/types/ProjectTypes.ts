import {TSkill} from 'Components/types/SkillTypes'
import {TProjectAnalyticsId} from 'JS/analytics/contracts'

type TProjectContent = {
    className?: string
    company?: string
    description: string | React.ReactNode
    imageUrl?: string
    role?: string
    technologies: TSkill[]
    dateRange?: string
    title?: string
}

type TLinkedProject = {
    analyticsId: TProjectAnalyticsId
    link: string
}

type TUnlinkedProject = {
    analyticsId?: never
    link?: never
}

export type TProject = TProjectContent & (TLinkedProject | TUnlinkedProject)

export type TProjects = TProject[]
