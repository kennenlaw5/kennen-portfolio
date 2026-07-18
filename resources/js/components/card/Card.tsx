import React, {useId, useState} from 'react'
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
    const [isContentOverflowVisible, setIsContentOverflowVisible] = useState(!isDropDown || defaultOpen)
    const contentId = useId()

    const toggleDropDown = () => {
        if (isDropDown) {
            if (isOpen) {
                setIsContentOverflowVisible(false)
            }

            setIsOpen(!isOpen)
        }
    }

    const handleContentTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && isOpen) {
            setIsContentOverflowVisible(true)
        }
    }

    return (
        <div className={classNames(styles.card, className)}>
            <CardTitle {...{
                header,
                isDropDown,
                isOpen,
                subHeader,
                contentId,
                toggleDropDown
            }} />

            <div
                id={contentId}
                aria-hidden={!isOpen}
                className={classNames(styles.cardContent, {
                    [styles.cardContentCollapsed]: !isOpen,
                    [styles.cardContentExpanded]: isOpen,
                })}
                onTransitionEnd={handleContentTransitionEnd}
            >
                <div className={classNames(styles.cardContentWrapper, {
                    [styles.cardContentWrapperClipped]: !isContentOverflowVisible,
                    [styles.cardContentWrapperOverflowVisible]: isContentOverflowVisible,
                })}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Card
