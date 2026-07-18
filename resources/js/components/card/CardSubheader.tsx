import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Card.module.scss'
import {THeader} from 'Components/card/types/CardTypes'

type TCardSubHeaderProps = {
    header: THeader
    subHeader: THeader
    isDropDown: boolean
}

const CardSubHeader: React.FC<TCardSubHeaderProps> = ({header, subHeader, isDropDown}) => {
    if (!subHeader || !header) {
        return null
    }

    const content = (
        <>
            <span className={styles.cardSubtitleSeparator}>&nbsp;-&nbsp;</span>
            {subHeader}
        </>
    )

    return isDropDown ? (
        <span className={classNames(styles.cardSubtitle, styles.cardSubtitleClickable)}>{content}</span>
    ) : (
        <h5 className={styles.cardSubtitle}>{content}</h5>
    )
}

export default CardSubHeader
