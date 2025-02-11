import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Skill.module.scss'
import {TSkillType} from 'Components/types/SkillTypes'
import {capitalize} from 'JS/helpers'

type TSkillProps = {
    name: string
    shouldShow?: boolean
    type: TSkillType
}

const Skill: React.FC<TSkillProps> = ({name, shouldShow = true, type}) => (
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
