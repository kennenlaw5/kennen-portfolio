import React, {useState} from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Card.module.scss'
import CardTitle from 'Components/card/CardTitle'
import {THeader} from 'Components/card/types/CardTypes'

type TCardProps = {
    children: string | React.ReactNode
    className?: string
    defaultOpen?: boolean
    header?: THeader
    isDropDown?: boolean
    subHeader?: THeader
}

const Card: React.FC<TCardProps> = (props) => {
    const {
        children,
        className,
        isDropDown = false,
        header,
        defaultOpen = false,
        subHeader,
    } = props
    const [isOpen, setIsOpen] = useState(!isDropDown || defaultOpen)

    const toggleDropDown = () => {
        if (isDropDown) {
            setIsOpen(!isOpen)
        }
    }

    return (
        <div className={classNames(styles.card, className)}>
            <CardTitle {...{
                header,
                isDropDown,
                isOpen,
                subHeader,
                toggleDropDown
            }} />

            <div className={classNames(styles.cardContent, {
                [styles.cardContentCollapsed]: !isOpen,
                [styles.cardContentExpanded]: isOpen,
            })}>
                <div className={styles.cardContentWrapper}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Card
