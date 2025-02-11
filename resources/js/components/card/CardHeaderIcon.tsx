import React from 'react'
import classNames from 'classnames'
import {FaChevronCircleDown, FaChevronDown, FaChevronUp} from 'react-icons/fa'
import styles from 'Sass/modules/Card.module.scss'

type TCardHeaderIconProps = {
    isDropDown: boolean
    isOpen: boolean
}

const CardHeaderIcon: React.FC<TCardHeaderIconProps> = ({isDropDown, isOpen}) => {
    return isDropDown ? (
        <span className={classNames(styles.cardHeaderIcon, {
            [styles.cardHeaderIconCollapsed]: !isOpen,
            [styles.cardHeaderIconExpanded]: isOpen,
        })}>
            <FaChevronDown />
        </span>
    ) : null
}

export default CardHeaderIcon
