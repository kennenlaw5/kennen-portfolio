import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Card.module.scss'
import {THeader} from 'Components/card/types/CardTypes'

type TCardHeaderProps = {
    header: THeader
    isDropDown: boolean
    subHeader: THeader
}

const CardHeader: React.FC<TCardHeaderProps> = ({header, isDropDown, subHeader}) => {
    if (!header && !subHeader) {
        return null
    }

    const className = classNames(styles.cardTitle, {'!font-normal': !header})

    return isDropDown ? (
        <span className={className}>{header || subHeader}</span>
    ) : (
        <h4 className={className}>{header || subHeader}</h4>
    )
}

export default CardHeader
