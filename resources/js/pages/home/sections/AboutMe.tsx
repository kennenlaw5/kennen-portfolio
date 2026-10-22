import React from 'react'
import {
    trackResumeDownloadIntent,
    RESUME_DOWNLOAD_PATH,
} from 'JS/pages/helpers'
import Section from 'Components/Section'
import {FaDownload} from 'react-icons/fa'

const AboutMe: React.FC = () => {
    return (
        <Section header="About Me" className="surface p-8 leading-relaxed">
            <p className="mb-4">
                I'm Kennen Lawrence, a senior full-stack engineer in the Denver area with
                7+ years in software-development roles and more than eight years on
                software-product teams.
            </p>
            <p className="mb-4">
                I spent seven years at A2Z Sync, progressing from help desk and QA to
                senior engineer. There I built automotive digital-retail software for
                dealerships, including inventory and pricing integrations for the Amazon
                Autos launch, CRM and credit-application integrations, and React
                performance work, while mentoring teammates through pairing and code reviews.
            </p>
            <p>
                Since then, I reduced CI build time by 57% at Engrain and helped guide AI
                adoption at Akido Labs, building reusable skills and agent workflows with
                validation loops and deliberate context and token control. Outside
                engineering, I serve in a leadership role with Excel Taekwondo.
            </p>
            <a
                href={RESUME_DOWNLOAD_PATH}
                onClick={() => trackResumeDownloadIntent('home')}
                className="button button-secondary glow-border mt-6"
                data-spotlight
            >
                <FaDownload aria-hidden="true" />
                <span className="glow-text" data-label="Download My Resume" data-spotlight>
                    Download My Resume
                </span>
            </a>
        </Section>
    )
}

export default AboutMe
