import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Card.module.scss'
import {THeader} from 'Components/card/types/card'

type TCardSubHeaderProps = {
    header: THeader
    subHeader: THeader
    isDropDown: boolean
}

const CardSubHeader: React.FC<TCardSubHeaderProps> = ({header, subHeader, isDropDown}) => {
    return subHeader && header ? (
        <h5 className={classNames(styles.cardSubtitle, {[styles.cardSubtitleClickable]: isDropDown})}>
            <span className={styles.cardSubtitleSeparator}>&nbsp;-&nbsp;</span>
            {subHeader}
        </h5>
    ) : null
}

export default CardSubHeader
