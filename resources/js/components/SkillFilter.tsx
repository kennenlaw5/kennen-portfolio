import React from 'react'
import classNames from 'classnames'
import {SKILL_TYPES} from 'Constants/skills'
import {TSkillType} from 'Components/types/SkillTypes'
import styles from 'Sass/modules/SkillFilter.module.scss'
import {capitalize} from 'JS/helpers'

type TSkillFilterProps = {
    selectedType: TSkillType
    onClick: (value: TSkillType) => void
    className?: string
}

const SkillFilter: React.FC<TSkillFilterProps> = ({selectedType, onClick, className}) => (
    <div className={classNames(styles.skillFilter, className)}>
        {Object.values(SKILL_TYPES).map((type) => (
            <button
                key={type}
                className={classNames(styles.skillFilterButton, styles[`skillFilterButton${capitalize(type)}`], {
                    [styles[`skillFilterButtonSelected${capitalize(type)}`]]: selectedType === type,
                    [styles[`skillFilterButtonUnselected${capitalize(type)}`]]: selectedType !== type
                })}
                onClick={() => onClick(type)}
            >
                {type.toUpperCase()}
            </button>
        ))}
    </div>
)

export default SkillFilter
