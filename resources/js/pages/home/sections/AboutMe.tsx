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
                I'm Kennen Lawrence from Denver, CO. I excel in fostering collaborative environments,
                leading high-impact projects, and aligning technical initiatives with business objectives.
            </p>
            <p>
                My experience spans from launching industry-first tools at A2Z Sync to modernizing legacy codebases.
                I am procient in engineering strategy and implementation, optimizing performance, enhancing system scalability,
                and ensuring software reliability. I continuously seek opportunities for growth through industry certications,
                staying up-to-date with emerging technologies, and leadership training. I continuously strive for excellence
                both in my professional career and through leadership roles, including my work with Excel Taekwondo.
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