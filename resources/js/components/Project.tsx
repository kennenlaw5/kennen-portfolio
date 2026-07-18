import React from 'react'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {FaCircleInfo} from 'react-icons/fa6'
import {TProject} from 'Components/types/ProjectTypes'
import Skill from 'Components/Skill'
import Card from 'Components/card/Card'
import Tooltip from 'Components/tooltip/Tooltip'
import TooltipTrigger from 'Components/tooltip/TooltipTrigger'
import TooltipText from 'Components/tooltip/TooltipText'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

type TProjectProps = {
    defaultOpen?: boolean
    isDropDown?: boolean
    project: TProject
}

const Project: React.FC<TProjectProps> = ({project, defaultOpen = false, isDropDown = false}) => {
    const {className, company, dateRange, description, link, role, technologies, title} = project
    const cardHeader = !title ? role : null
    const subText = `at ${company} (${dateRange})`

    return (
        <Card {...{
            className,
            header: cardHeader,
            subHeader: !title ? subText : null,
            isDropDown,
            defaultOpen,
        }}>
            <h4 className="font-semibold mb-2">
                {link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link inline-flex text-gray-700"
                        onClick={() => trackEvent(ANALYTICS_EVENTS.PROJECT_LINK_CLICKED, {
                            label: title || role || 'Untitled project',
                        })}
                    >
                        {title}
                        <FaExternalLinkAlt className='my-auto ml-2' aria-hidden="true" />
                    </a>
                ) : title}
            </h4>
            <div className="text-gray-600 mb-2">{description}</div>
            {technologies.length ? (
                <>
                    <Tooltip className='mb-2 text-gray-600'>
                        <TooltipTrigger>
                            <span className='inline-flex font-semibold'>
                                Highlighted Skills&nbsp;
                                <FaCircleInfo className='my-auto' />
                            </span>
                        </TooltipTrigger>
                        <TooltipText>
                            These skills represent key highlights, not a comprehensive list of all skills utilized.
                        </TooltipText>
                    </Tooltip>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map(({name, type}) => (
                            <Skill key={name} type={type} name={name} />
                        ))}
                    </div>
                </>
            ) : null}
        </Card>
    )
}

export default Project
