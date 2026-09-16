import {ROUTES} from 'Constants/routes'
import React from 'react'
import {Link} from 'react-router'
import Skills from 'JS/pages/home/sections/Skills'
import AboutMe from 'JS/pages/home/sections/AboutMe'
import Certificates from 'Components/Certificates'
import Section from 'Components/Section'
import FeaturedExperiences from './sections/FeaturedExperiences'

const Home: React.FC = () => {
  return (
    <>
      <Section className="bg-white shadow rounded p-8">
        <div className="text-center">
          <h1 className="mb-4">Senior Full-Stack Software Engineer & Technical Leader</h1>
          <p className="text-xl text-gray-700 mb-6">
              7+ years in software development roles and more than eight years building and
              supporting software products. My work spans clinical platforms, high-performance web products,
              and practical AI-assisted engineering workflows.
          </p>
          <p className="text-lg text-gray-700 mb-6">
              I turn business needs into custom software and automation, and help teams
              adopt AI within their existing systems with security, reliability, and cost in mind.
          </p>
          <Link to={ROUTES.EXPERIENCE.path} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            View My Work
          </Link>
        </div>
      </Section>
      <FeaturedExperiences />
      <Skills />
      <AboutMe />
      <Certificates />
    </>
  )
}

export default Home
