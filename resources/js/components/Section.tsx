import React from 'react'
import classNames from 'classnames'

type TCard = {
    children: string | React.ReactNode
    className?: string
    header?: string | React.ReactNode,
    subHeader?: string | React.ReactNode,
}

const Section: React.FC<TCard> = ({children, className, header, subHeader}) => (
    <section className={classNames('mb-8', className)}>
        {header || subHeader ? (
            <div className='md:flex md:flex-wrap mb-4'>
                {header ? <h2>{header}</h2> : null}
                {subHeader ? (
                    <h3 className="text-gray-500 mt-2 md:mt-auto md:inline-flex">
                        <span className="hidden md:inline-block">&nbsp;-&nbsp;</span>
                        {subHeader}
                    </h3>
                ) : null}
            </div>
        ) : null}
        {children}
    </section>
)

export default Section
