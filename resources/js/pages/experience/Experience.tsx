import React, { Fragment } from 'react'
import Section from 'Components/Section'
import Project from 'Components/Project'
import {SKILLS} from 'Constants/skills'
import {TProjects} from 'Components/types/ProjectTypes'
import {
  A2zInStoreDescription,
  A2zOnlineDescription,
  AmazonAutosDescription,
  EngineerDescription,
  HelpDeskDescription,
  JuniorEngineerDescription,
  SeniorEngineerDescription
} from 'Components/ExperienceDescriptions'

interface integrationProps {
    name: string
}

const Experience: React.FC = () => {
  const projects: TProjects = [
    {
      title: 'Amazon Autos',
      description: <AmazonAutosDescription />,
      link: 'https://www.amazon.com/Amazon-Autos/b?ie=UTF8&node=10677469011',
      className: 'col-span-full',
      technologies: [
        SKILLS.REACT,
        SKILLS.TYPESCRIPT,
        SKILLS.AWS_ECOSYSTEM,
        SKILLS.PHP,
        SKILLS.MICROSERVICES,
        SKILLS.JIRA,
        SKILLS.BITBUCKET,
        SKILLS.PHPUNIT,
      ],
    },
    {
      title: 'A2Z Sync In-Store Application',
      description: <A2zInStoreDescription />,
      link: 'https://a2zsync.com/in-store/',
      technologies: [
        SKILLS.REACT,
        SKILLS.TYPESCRIPT,
        SKILLS.AWS_ECOSYSTEM,
        SKILLS.PHP,
        SKILLS.MICROSERVICES,
        SKILLS.LARAVEL,
        SKILLS.SQL,
        SKILLS.NODEJS,
      ],
    },
    {
      title: 'A2Z Sync Digital Retail Tool',
      description: <A2zOnlineDescription />,
      link: 'https://a2zsync.com/online/',
      technologies: [
        SKILLS.REACT,
        SKILLS.TYPESCRIPT,
        SKILLS.GATSBY,
        SKILLS.AXIOS,
        SKILLS.PHP,
        SKILLS.WEBPACK,
        SKILLS.CSS_SCSS,
      ],
    },
  ]

  const otherProjects: TProjects = [
      {
          description: <SeniorEngineerDescription />,
          company: 'A2Z Sync Inc.',
          dateRange: 'July 2021–Present',
          role: 'Senior Software Engineer',
          className: 'col-span-full',
          technologies: [],
      },
      {
          description: <EngineerDescription />,
          company: 'A2Z Sync Inc.',
          dateRange: 'July 2019–July 2021',
          role: 'Software Engineer',
          className: 'col-span-full',
          technologies: [],
      },
      {
          description: <JuniorEngineerDescription />,
          company: 'A2Z Sync Inc.',
          dateRange: 'Feb 2019–Jul 2020',
          role: 'Junior Software Engineer',
          className: 'col-span-full',
          technologies: [],
      },
      {
          description: <HelpDeskDescription />,
          company: 'A2Z Sync Inc.',
          dateRange: 'Feb 2018–Feb 2019',
          role: 'Help Desk Technician & QA Engineer',
          className: 'col-span-full',
          technologies: [],
      },
  ]
    const integrations: integrationProps[] = [
        {name: 'Integration 1'},
        {name: 'Integration 2'},
        {name: 'Integration 3'}
    ]

  return (
    <>
      <Section header="Projects & Experience">
        <p className="mb-4 text-gray-600 text-xl">
          Here's a selection of projects that showcase my skills and experience.
        </p>
      </Section>
      <Section>
        <h3 className="font-bold mt-8 mb-4">Featured Projects</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Fragment key={project.title || project.role}>
              <Project project={project} />
              {/* @todo: Implement a duplicate card that can dropdown for mobile */}
              {/* @todo: Also, give card context to allow for dynamic headers <Card><CardHeader></CardHeader></Card> */}
              {/* <Project key={project.title} project={project} isDropDown defaultOpen /> */}
            </Fragment>
          ))}
        </div>
      </Section>
      <Section>
        <h3 className="font-bold mt-8 mb-4">Experience</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {otherProjects.map((project) => (
                <Project key={project.title || project.role} project={project} isDropDown />
            ))}
        </div>
      </Section>
  
      {/* @todo: Integrations (Stubbed) Will revisit tomorrow. I need to eat food. */}
      {/* <Section>
        <h3 className="font-bold mt-8 mb-4">Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                  <div key={integration.name} className="bg-white shadow rounded p-4">
                      <h3 className="font-bold text-lg mb-2">
                        {integration.name}
                      </h3>
                      <p className="text-gray-700 mb-2">Details coming soon!</p>
                  </div>
              ))}
          </div>
      </Section> */}
    </>
  )
}

export default Experience
