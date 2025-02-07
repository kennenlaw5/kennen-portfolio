import {SKILL_TYPES} from 'Constants/skills'

export type TSkillType = typeof SKILL_TYPES[keyof typeof SKILL_TYPES]
export type TSkills = {
    [key: string]: {
        name: string
        type: TSkillType
    }
}