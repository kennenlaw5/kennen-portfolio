import React from 'react'
import styles from 'Sass/modules/Tooltip.module.scss'
import {useTooltipContext} from 'Components/tooltip/context/TooltipContext'

type TTooltipTriggerProps = {
  children: React.ReactNode
}

const TooltipTrigger: React.FC<TTooltipTriggerProps> = ({children}) => {
    const {setShowTooltip, tooltipId} = useTooltipContext()

    return (
        <button
            type="button"
            aria-describedby={tooltipId}
            className={styles.tooltipTrigger}
            onBlur={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(true)}
            onFocus={() => setShowTooltip(true)}
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    setShowTooltip(false)
                    event.currentTarget.blur()
                }
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={(event) => {
                if (document.activeElement !== event.currentTarget) {
                    setShowTooltip(false)
                }
            }}
        >
            {children}
        </button>
    )
}

export default TooltipTrigger
