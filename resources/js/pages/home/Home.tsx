import {ROUTES} from 'Constants/routes'
import React from 'react'
import {Link} from 'react-router-dom'
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
          <h1 className="text-4xl font-bold mb-4">Innovative Software Engineer & Technical Leader</h1>
          <p className="text-xl text-gray-700 mb-6">
            Building scalable solutions and fostering collaboration through technology.
          </p>
          <Link to={ROUTES.PROJECTS.path} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            View My Work
          </Link>
        </div>
      </Section>
      <Certificates />
      <FeaturedExperiences />
      <Skills />
      <AboutMe />
    </>
  )
}

export default Home
