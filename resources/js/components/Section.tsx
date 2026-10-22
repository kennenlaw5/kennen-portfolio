import React from 'react'
import classNames from 'classnames'

type TCard = {
    children: string | React.ReactNode
    className?: string
    header?: string | React.ReactNode,
    subHeader?: string | React.ReactNode,
}

const Section: React.FC<TCard> = ({children, className, header, subHeader}) => (
    <section className={classNames('mb-12 md:mb-16', className)}>
        {header || subHeader ? (
            <div className='md:flex md:flex-wrap md:items-center mb-6'>
                {header ? (
                    <h2 className="flex items-center gap-3">
                        <span
                            aria-hidden="true"
                            className="h-7 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500"
                        />
                        {header}
                    </h2>
                ) : null}
                {subHeader ? (
                    <h3 className="text-slate-400 mt-2 md:mt-auto md:inline-flex">
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
