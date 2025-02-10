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
            <h4 className="font-bold">{header}</h4>
            {subheader ? <h5 className="text-gray-500 ml-2">{subheader}</h5> : null}
        </div>
        {children}
    </div>
)

export default Card
