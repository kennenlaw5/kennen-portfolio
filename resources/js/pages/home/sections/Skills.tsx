import React, { useState } from 'react'
import Skill from 'Components/Skill'
import {SKILL_TYPES, SKILLS} from 'Constants/skills'
import {TSkillType} from 'JS/pages/home/sections/types/Skills'
import SkillFilter from 'Components/SkillFilter'
import Section from 'Components/Section'

const Skills: React.FC = () => {
    const [selectedSkillType, setSelectedSkillType] = useState<TSkillType>(SKILL_TYPES.ALL)

    const handleTypeChange = (value: TSkillType) => {
        setSelectedSkillType(value)
    }

    const renderSubHeader = () => (
        <SkillFilter selectedType={selectedSkillType} onClick={handleTypeChange} className="ml-4" />
    )

    return (
        <Section
            header="Skills & Technologies"
            subheader={renderSubHeader()}
        >
            <div className="flex flex-wrap gap-4">
                {Object.values(SKILLS).map(({name, type}) => {
                    const shouldShow = selectedSkillType === SKILL_TYPES.ALL || selectedSkillType === type

                    return shouldShow ? <Skill key={name}>{name}</Skill> : null
                })}
            </div>
      </Section>
    )
}

export default Skills