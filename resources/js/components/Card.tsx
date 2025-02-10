import React from 'react'
import classNames from 'classnames'

type TCard = {
    children: string | React.ReactNode
    className?: string
    header: string | React.ReactNode,
    subheader?: string | React.ReactNode,
}

const Card: React.FC<TCard> = ({children, className, header, subheader}) => (
    <div className={classNames('p-4 bg-white shadow rounded select-none cursor-default', className)}>
        {header || subheader ? (
            <div className='sm:flex sm:flex-row mb-2'>
                {header ? <h4 className="font-bold">{header}</h4> : null}
                {subheader ? (
                    <h5 className="text-gray-500 sm:mt-auto sm:inline-flex">
                        <span className="hidden sm:inline-block">&nbsp;-&nbsp;</span>
                        {subheader}
                    </h5>
                ) : null}
            </div>
        ): null}
        {children}
    </div>
)

export default Card
