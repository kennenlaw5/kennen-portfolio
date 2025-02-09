import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/Skill.module.scss'
import {TSkillType} from 'JS/pages/home/sections/types/Skills'
import {capitalize} from 'JS/helpers'

type TSkillProps = {
    name: string
    shouldShow: boolean
    type: TSkillType
}

const Skill: React.FC<TSkillProps> = ({shouldShow, name, type}) => (
    <span
        className={classNames(
            styles.skill,
            styles[`skill${capitalize(type)}`],
            {'hidden': !shouldShow}
        )}
    >
        {name}
    </span>
)

export default Skill
