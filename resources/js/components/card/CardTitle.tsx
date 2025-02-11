import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Card.module.scss'
import CardHeader from 'Components/card/CardHeader'
import {THeader} from 'Components/card/types/card'
import CardSubHeader from 'Components/card/CardSubheader'
import CardHeaderIcon from 'Components/card/CardHeaderIcon'

type TCardTitleProps = {
    header: THeader
    isDropDown: boolean,
    isOpen: boolean,
    subHeader: THeader,
    toggleDropDown: () => void,
}

const CardTitle: React.FC<TCardTitleProps> = (props) => {
    const {
        header,
        isDropDown = false,
        isOpen,
        subHeader,
        toggleDropDown
    } = props

    return (
        <div
            className={classNames(styles.cardHeader, {[styles.cardHeaderIconClickable]: isDropDown})}
            onClick={toggleDropDown}
        >
            {header || subHeader ? (
                <div className={styles.cardHeaderContent}>
                    <CardHeader {...{header, subHeader}} />
                    <CardSubHeader {...{header, subHeader, isDropDown}} />
                </div>
            ) : null}
            <CardHeaderIcon {...{isDropDown, isOpen}} />
        </div>
    )
}

export default CardTitle
