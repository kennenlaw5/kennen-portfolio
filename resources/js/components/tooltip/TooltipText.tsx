import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Tooltip.module.scss'
import {useTooltipContext} from 'Components/tooltip/context/TooltipContext'

type TTooltipTextProps = {
  children: React.ReactNode
}

const TooltipText: React.FC<TTooltipTextProps> = ({children}) => {
    const {showTooltip} = useTooltipContext()

    return (
        <div className={classNames(styles.tooltipText, {
            [styles.tooltipTextShow]: showTooltip,
            [styles.tooltipTextHide]: !showTooltip
        })}>
            {children}
        </div>
    )
}

export default TooltipText
