import React from 'react'
import {Link} from 'react-router'
import {FaArrowRight} from 'react-icons/fa'
import {ROUTES} from 'Constants/routes'
import Section from 'Components/Section'
import HeroProfileWindow from './HeroProfileWindow'

const Hero: React.FC = () => (
    <Section className="pt-6 pb-4 lg:pt-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div>
                <p className="eyebrow mb-6">
                    <span aria-hidden="true" className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                    </span>
                    Full-Stack · AI-Assisted Engineering
                </p>
                <h1 className="mb-6 text-4xl leading-tight sm:text-5xl sm:leading-tight">
                    Senior Full-Stack Software Engineer{' '}
                    <span className="text-gradient">&amp; Technical Leader</span>
                </h1>
                <p className="text-lg text-slate-300 mb-4 sm:text-xl">
                    7+ years in software development roles and more than eight years building and
                    supporting software products. Most of that time was spent at A2Z Sync building automotive
                    digital-retail platforms and integrations, with recent work focused on practical
                    AI-assisted workflows.
                </p>
                <p className="text-lg text-slate-400 mb-8">
                    I turn business needs into custom software and automation, and help teams
                    adopt AI within their existing systems with security, reliability, and cost in mind.
                </p>
                <Link to={ROUTES.EXPERIENCE.path} className="button button-primary">
                    View My Work
                    <FaArrowRight aria-hidden="true" />
                </Link>
            </div>
            <HeroProfileWindow />
        </div>
    </Section>
)

export default Hero
