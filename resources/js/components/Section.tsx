import React from 'react'
import classNames from 'classnames'

type TCard = {
    children: string | React.ReactNode
    className?: string
    header?: string | React.ReactNode,
    subheader?: string | React.ReactNode,
}

const Section: React.FC<TCard> = ({children, className, header, subheader}) => (
    <section className={classNames('mb-8', className)}>
        {header || subheader ? (
            <div className='md:flex md:flex-wrap mb-4'>
                {header ? <h2 className="text-3xl font-bold">{header}</h2> : null}
                {subheader ? <h2 className="text-2xl text-gray-500 mt-2 md:mt-0 md:ml-4">{subheader}</h2> : null}
            </div>
        ) : null}
        {children}
    </section>
)

export default Section
