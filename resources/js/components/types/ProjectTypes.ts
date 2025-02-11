import {TSkill} from 'Components/types/SkillTypes'

export type TProject = {
    className?: string
    company?: string
    description: string | React.ReactNode
    imageUrl?: string
    link?: string
    role?: string
    technologies: TSkill[]
    dateRange?: string
    title?: string
}

export type TProjects = TProject[]