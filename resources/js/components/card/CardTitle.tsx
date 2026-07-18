import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Card.module.scss'
import CardHeader from 'Components/card/CardHeader'
import {THeader} from 'Components/card/types/CardTypes'
import CardSubHeader from 'Components/card/CardSubheader'
import CardHeaderIcon from 'Components/card/CardHeaderIcon'

type TCardTitleProps = {
    contentId: string
    header: THeader
    isDropDown: boolean,
    isOpen: boolean,
    subHeader: THeader,
    toggleDropDown: () => void,
}

const CardTitle: React.FC<TCardTitleProps> = (props) => {
    const {
        contentId,
        header,
        isDropDown = false,
        isOpen,
        subHeader,
        toggleDropDown
    } = props

    const headerContent = (
        <>
            <CardHeader {...{header, subHeader, isDropDown}} />
            <CardSubHeader {...{header, subHeader, isDropDown}} />
        </>
    )

    const titleContent = (
        <>
            {header || subHeader ? (isDropDown ? (
                <span className={styles.cardHeaderContent}>
                    {headerContent}
                </span>
            ) : (
                <div className={styles.cardHeaderContent}>
                    {headerContent}
                </div>
            )) : null}
            <CardHeaderIcon {...{isDropDown, isOpen}} />
        </>
    )

    return isDropDown ? (
        <button
            type="button"
            aria-controls={contentId}
            aria-expanded={isOpen}
            className={classNames(styles.cardHeader, styles.cardHeaderIconClickable)}
            onClick={toggleDropDown}
        >
            {titleContent}
        </button>
    ) : (
        <div className={styles.cardHeader}>
            {titleContent}
        </div>
    )
}

export default CardTitle
