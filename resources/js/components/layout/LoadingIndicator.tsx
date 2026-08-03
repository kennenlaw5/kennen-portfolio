import React from 'react'
import classNames from 'classnames'
import {FaSpinner} from 'react-icons/fa'

type TLoadingIndicatorProps = {
    label: string
    className?: string
}

const LoadingIndicator: React.FC<TLoadingIndicatorProps> = ({label, className}) => (
    <div
        className={classNames('flex items-center justify-center', className)}
        role="status"
    >
        <FaSpinner
            aria-hidden="true"
            className="animate-spin text-blue-600 text-4xl mb-4 motion-reduce:animate-none"
        />
        <span className="sr-only">{label}</span>
    </div>
)

export default LoadingIndicator
