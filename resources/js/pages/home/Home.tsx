import {ROUTES} from 'Constants/routes'
import React from 'react'
import {Link} from 'react-router-dom'
import Skills from 'JS/pages/home/sections/Skills'
import AboutMe from 'JS/pages/home/sections/AboutMe'
import Certificates from 'Components/Certificates'
import Section from 'Components/Section'

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

      {/* Featured Experience Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded p-4">
            <h3 className="font-bold text-xl mb-2">Amazon Autos Partnership</h3>
            <p>Played a pivotal role in launching Amazon Autos at A2Z Sync, establishing the company as a market leader.</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="font-bold text-xl mb-2">Scalable React Libraries</h3>
            <p>Designed reusable React components that optimized UI performance, reducing load times by up to 50%.</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="font-bold text-xl mb-2">Legacy Code Modernization</h3>
            <p>Led efforts to refactor and modernize legacy systems, improving maintainability and performance.</p>
          </div>
        </div>
      </section>
      <Skills />
      <AboutMe />
    </>
  )
}

export default Home
