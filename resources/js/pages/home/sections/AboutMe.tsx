import React from 'react'
import { downloadResume } from 'JS/pages/helpers'
import Section from 'Components/Section'

const AboutMe: React.FC = () => (
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
        {/* @todo: disable button on click */}
        <button
            onClick={downloadResume}
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
            Download My Resume
        </button>
    </Section>
)

export default AboutMe