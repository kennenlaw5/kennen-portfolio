import React from 'react'
import Section from 'Components/Section'
import {FaExternalLinkAlt} from 'react-icons/fa'

const Projects: React.FC = () => {
  return (
    <Section header="Projects">
      <p className="mt-4">
        Here are some projects that highlight my skills and achievements.
      </p>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">My Projects</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded p-4">
            <h4 className="font-semibold">
              <a
                href="https://www.amazon.com/Amazon-Autos/b?ie=UTF8&node=10677469011"
                className="link inline-flex text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Amazon Autos
                <FaExternalLinkAlt className='my-auto ml-2' />
              </a>
            </h4>
            <p className="mt-2 text-gray-600">
              Developed a groundbreaking e-commerce platform that transformed the automotive retail experience,
              empowering customers to effortlessly discover, finance, and acquire new vehicles online from local
              dealerships, simplifying a traditionally complex process.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Projects;
