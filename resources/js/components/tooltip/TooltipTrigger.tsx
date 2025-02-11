import React from 'react'
import styles from 'Sass/modules/Tooltip.module.scss'
import {useTooltipContext} from 'Components/tooltip/context/TooltipContext'

type TTooltipTriggerProps = {
  children: React.ReactNode
}

const TooltipTrigger: React.FC<TTooltipTriggerProps> = ({children}) => {
    const {setShowTooltip} = useTooltipContext()

    return (
        <div
            className={styles.tooltipTrigger}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {children}
        </div>
    )
}

export default TooltipTrigger
