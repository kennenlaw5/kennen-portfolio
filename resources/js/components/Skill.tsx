import React from 'react'
import styles from 'Sass/Skill.module.scss'

type TSkillProps = {
    children: React.ReactNode
}

const Skill: React.FC<TSkillProps> = ({children}) => (
    // <span className="cursor-default bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{children}</span>
    <span className={styles.skill}>{children}</span>
)

export default Skill