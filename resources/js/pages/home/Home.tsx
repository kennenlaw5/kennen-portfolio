import React from 'react'
import Skills from 'JS/pages/home/sections/Skills'
import AboutMe from 'JS/pages/home/sections/AboutMe'
import Certificates from 'Components/Certificates'
import Hero from './sections/Hero'
import FeaturedExperiences from './sections/FeaturedExperiences'

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <FeaturedExperiences />
      <Skills />
      <AboutMe />
      <Certificates />
    </>
  )
}

export default Home
