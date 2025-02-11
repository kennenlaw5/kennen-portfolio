import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Tooltip.module.scss'
import {TooltipContextProvider} from 'Components/tooltip/context/TooltipContext'

type TTooltipProps = {
  children: React.ReactNode
  className?: string
}

const Tooltip: React.FC<TTooltipProps> = ({children, className}) => {

    return (
        <TooltipContextProvider>
            <div className={classNames(styles.tooltip, className)}>
                {children}
            </div>
        </TooltipContextProvider>
    )
}

export default Tooltip
