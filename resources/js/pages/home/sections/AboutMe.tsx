import React, {useState} from 'react'
import classNames from 'classnames'
import {downloadResume} from 'JS/pages/helpers'
import Section from 'Components/Section'
import {FaSpinner} from 'react-icons/fa'

const AboutMe: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)

    const handleButtonClick = () => {
        setIsLoading(true)

        downloadResume()
            .finally(() => setIsLoading(false))
    }

    return (
        <Section header="About Me" className="bg-white shadow rounded p-8">
            <p className="mb-4">
                I'm Kennen Lawrence, a senior full-stack engineer in the Denver area with
                7+ years in software-development roles and more than eight years on
                software-product teams.
            </p>
            <p className="mb-4">
                At Akido Labs, I work across a FHIR-based clinical platform and build
                TypeScript features with Next.js, React, NestJS, Node.js, GraphQL, and
                PostgreSQL. I also create reusable prompts, skills, and agent workflows
                with validation loops and deliberate context and token control.
            </p>
            <p>
                Previously, I reduced CI build time by 57% at Engrain and progressed from
                help desk and QA to senior engineer at A2Z Sync, where I contributed to
                Amazon Autos, digital retail products, integrations, and team mentorship.
                Outside engineering, I serve in a leadership role with Excel Taekwondo.
            </p>
            <button
                onClick={handleButtonClick}
                className="relative inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                <span className={classNames({invisible: isLoading})}>Download My Resume</span>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaSpinner className="animate-spin text-white text-lg" />
                    </div>
                ) : null}
            </button>
        </Section>
    )
}

export default AboutMe
