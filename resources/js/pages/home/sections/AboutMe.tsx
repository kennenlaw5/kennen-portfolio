import React from 'react'
import {
    trackResumeDownloadIntent,
    RESUME_DOWNLOAD_PATH,
} from 'JS/pages/helpers'
import Section from 'Components/Section'
import {FaDownload} from 'react-icons/fa'

const AboutMe: React.FC = () => {
    return (
        <Section header="About Me" className="bg-white shadow rounded p-8">
            <p className="mb-4">
                I'm Kennen Lawrence, a senior full-stack engineer in the Denver area with
                7+ years in software-development roles and more than eight years on
                software-product teams.
            </p>
            <p className="mb-4">
                Most recently, at Akido Labs, I worked across a FHIR-based clinical
                platform and built TypeScript features with Next.js, React, NestJS,
                Node.js, GraphQL, and PostgreSQL. I also created reusable prompts,
                skills, and agent workflows with validation loops and deliberate
                context and token control.
            </p>
            <p>
                Before that, I reduced CI build time by 57% at Engrain and progressed from
                help desk and QA to senior engineer at A2Z Sync, where I contributed to
                Amazon Autos, digital retail products, integrations, and team mentorship.
                Outside engineering, I serve in a leadership role with Excel Taekwondo.
            </p>
            <a
                href={RESUME_DOWNLOAD_PATH}
                onClick={trackResumeDownloadIntent}
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
                <span className="inline-flex items-center gap-2">
                    <FaDownload aria-hidden="true" />
                    Download My Resume
                </span>
            </a>
        </Section>
    )
}

export default AboutMe
