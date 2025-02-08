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
        <div className='md:flex md:flex-row mb-2'>
            <h3 className="font-bold text-xl">{header}</h3>
            {subheader ? <h3 className="text-lg text-gray-500 ml-2">{subheader}</h3> : null}
        </div>
        {children}
    </div>
)

export default Card
