import React, { Fragment } from 'react'
import Section from 'Components/Section'
import Project from 'Components/Project'
import Card from 'Components/card/Card'
import {SKILLS} from 'Constants/skills'
import {TProjects} from 'Components/types/ProjectTypes'
import {
  A2zInStoreDescription,
  A2zOnlineDescription,
  AkidoDescription,
  AkidoProjectDescription,
  AmazonAutosDescription,
  EngrainDescription,
  EngrainProjectDescription,
  EngineerDescription,
  HelpDeskDescription,
  JuniorEngineerDescription,
  SeniorEngineerDescription
} from 'Components/ExperienceDescriptions'

interface integrationProps {
    name: string
}

type TExperienceRole = {
    dateRange: string
    description: React.ReactNode
    title: string
}

type TExperienceCompany = {
    className?: string
    company: string
    dateRange: string
    roles: TExperienceRole[]
}

const Experience: React.FC = () => {
  const projects: TProjects = [
    {
      title: 'Akido Labs — Clinical Platform and AI-Assisted Engineering',
      description: <AkidoProjectDescription />,
      link: 'https://www.akidolabs.com/',
      company: 'Akido Labs',
      dateRange: 'Feb 2026–Present',
      role: 'Senior Full-Stack Software Engineer',
      technologies: [
        SKILLS.TYPESCRIPT,
        SKILLS.NEXTJS,
        SKILLS.NESTJS,
        SKILLS.GRAPHQL,
        SKILLS.FHIR_R4,
        SKILLS.POSTGRESQL,
        SKILLS.AGENTIC_WORKFLOWS,
        SKILLS.VALIDATION_LOOPS,
        SKILLS.CONTEXT_CONTROL,
      ],
    },
    {
      title: 'Engrain — CI Build-Time Reduction and AI Workflows',
      description: <EngrainProjectDescription />,
      link: 'https://www.engrain.com/',
      company: 'Engrain',
      dateRange: 'Apr 2025–Feb 2026',
      role: 'Senior Full Stack Engineer',
      technologies: [
        SKILLS.LARAVEL,
        SKILLS.REACT,
        SKILLS.REDUX,
        SKILLS.MYSQL,
        SKILLS.REST_APIS,
        SKILLS.DOCKER,
        SKILLS.CI_CD,
        SKILLS.REUSABLE_SKILLS,
      ],
    },
    {
      title: 'Amazon Autos',
      description: <AmazonAutosDescription />,
      link: 'https://www.amazon.com/Amazon-Autos/b?ie=UTF8&node=10677469011',
      company: 'A2Z Sync Inc.',
      dateRange: 'Jul 2021–Feb 2025',
      role: 'Senior Software Engineer',
      className: 'col-span-full',
      technologies: [
        SKILLS.TYPESCRIPT,
        SKILLS.PHP,
        SKILLS.AWS,
        SKILLS.REST_APIS,
        SKILLS.MICROSERVICES,
      ],
    },
    {
      title: 'A2Z Sync In-Store Application',
      description: <A2zInStoreDescription />,
      link: 'https://a2zsync.com/in-store/',
      company: 'A2Z Sync Inc.',
      dateRange: 'Jul 2019–Feb 2025',
      role: 'Software Engineer through Senior Software Engineer',
      technologies: [
        SKILLS.REACT,
        SKILLS.TYPESCRIPT,
        SKILLS.AWS,
        SKILLS.PHP,
        SKILLS.MICROSERVICES,
        SKILLS.LARAVEL,
        SKILLS.REST_APIS,
        SKILLS.NODEJS,
      ],
    },
    {
      title: 'A2Z Sync Digital Retail Tool',
      description: <A2zOnlineDescription />,
      link: 'https://a2zsync.com/online/',
      company: 'A2Z Sync Inc.',
      dateRange: 'Jul 2019–Feb 2025',
      role: 'Software Engineer through Senior Software Engineer',
      technologies: [
        SKILLS.REACT,
        SKILLS.TYPESCRIPT,
        SKILLS.GATSBY,
        SKILLS.AXIOS,
        SKILLS.PHP,
        SKILLS.MYSQL,
        SKILLS.WEBPACK,
        SKILLS.CSS_SCSS,
      ],
    },
  ]

  const experience: TExperienceCompany[] = [
    {
      company: 'Akido Labs',
      dateRange: 'Feb 2026–Present',
      roles: [
        {
          title: 'Senior Full-Stack Software Engineer',
          dateRange: 'Feb 2026–Present',
          description: <AkidoDescription />,
        },
      ],
    },
    {
      company: 'Engrain',
      dateRange: 'Apr 2025–Feb 2026',
      roles: [
        {
          title: 'Senior Full Stack Engineer',
          dateRange: 'Apr 2025–Feb 2026',
          description: <EngrainDescription />,
        },
      ],
    },
    {
      company: 'A2Z Sync Inc.',
      dateRange: 'Feb 2018–Feb 2025',
      className: 'col-span-full',
      roles: [
        {
          title: 'Senior Software Engineer',
          dateRange: 'Jul 2021–Feb 2025',
          description: <SeniorEngineerDescription />,
        },
        {
          title: 'Software Engineer',
          dateRange: 'Jul 2019–Jul 2021',
          description: <EngineerDescription />,
        },
        {
          title: 'Junior Software Engineer',
          dateRange: 'Feb 2019–Jul 2019',
          description: <JuniorEngineerDescription />,
        },
        {
          title: 'Help Desk Technician & QA Engineer',
          dateRange: 'Feb 2018–Feb 2019',
          description: <HelpDeskDescription />,
        },
      ],
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
          Senior full-stack engineer with 7+ years in software-development roles
          and more than eight years on software-product teams.
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
          {experience.map(({className, company, dateRange, roles}) => (
            <Card
              key={company}
              className={className}
              header={company}
              subHeader={dateRange}
              isDropDown
            >
              <div className="space-y-6">
                {roles.map((role, index) => (
                  <div
                    key={`${company}-${role.title}`}
                    className={index ? 'border-t border-gray-200 pt-6' : ''}
                  >
                    <div className="sm:flex sm:items-baseline sm:justify-between sm:gap-4">
                      <h5 className="font-semibold text-gray-800">{role.title}</h5>
                      {roles.length > 1 ? (
                        <p className="text-sm text-gray-500 whitespace-nowrap">{role.dateRange}</p>
                      ) : null}
                    </div>
                    <div className="text-gray-600 mt-2">{role.description}</div>
                  </div>
                ))}
              </div>
            </Card>
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
