import React from 'react'

export const AkidoProjectDescription: React.FC = () => (
    <p>
        Built TypeScript features across a multi-repository, FHIR-based clinical
        platform using Next.js, React, NestJS, Node.js, GraphQL, PostgreSQL, and Kafka.
        Used Codex alongside Claude Code CLI configured through Amazon Bedrock, with MCP
        integrations, to create reusable skills and multi-step agent workflows with
        validation and retry loops while controlling context and token usage to
        minimize overhead.
    </p>
)

export const EngrainProjectDescription: React.FC = () => (
    <p>
        Reduced CI build time by 57%, from 46 minutes to 20 minutes, by changing
        the test strategy and allocating build resources more efficiently. Used
        Codex CLI, Claude Code CLI, and GitHub Copilot CLI with MCP integrations and
        structured prompts for codebase research, implementation planning, debugging,
        and test design.
    </p>
)

export const AmazonAutosDescription: React.FC = () => (
    <p>
        Amazon Autos allows customers to research, finance, and purchase vehicles
        from local dealerships directly on{' '}
        <a
            href="https://www.amazon.com/"
            className="underline link"
            target="_blank"
            rel="noopener noreferrer"
        >
            Amazon.com
        </a>
        . During my tenure as a Senior Software Engineer at A2Z Sync, I developed
        and maintained the inventory syndication feed for thousands of vehicles
        across hundreds of dealerships and implemented a bulk pricing engine that
        used data from A2Z Sync's in-store pricing tools. This work kept vehicle and
        pricing data accurate as traffic grew across the partner platform.
    </p>
)

export const A2zInStoreDescription: React.FC = () => (
  <p>
    A2Z Sync's In-Store Digital Retail Platform is a suite of tools designed to
    modernize the car-buying experience within dealership showrooms. The platform
    provides interactive kiosks and staff-facing applications that allow customers
    to browse inventory, configure vehicles, explore financing options, and
    streamline the sales process.
    <br /><br />
    As a Senior Software Engineer, I enhanced performance, integrated with major
    CRM systems including{' '}
    <a
      href="https://www.vinsolutions.com/"
      className="underline link"
      target="_blank"
      rel="noopener noreferrer"
    >
      VinSolutions
    </a>
    {' '}and ELEAD, and improved the user experience. My work helped scale the
    platform from seven dealership rooftops across three clients to hundreds of
    dealerships nationwide.
  </p>
)

export const A2zOnlineDescription: React.FC = () => (
  <p>
    A2Z Sync's Online Digital Retail Platform provides a customizable online
    car-buying experience with vehicle inventory, payment calculations, credit
    applications, trade-in valuations, and e-contracting.
    <br /><br />
    I owned the credit-application integration with multiple credit bureaus and
    lending providers and contributed to the platform's architecture. During my
    tenure, this work helped the platform become a{' '}
    <a
      href="https://www.mazdadigitalcertified.com/MazdaDigitalShowroom/A2ZSync"
      className="underline link"
      target="_blank"
      rel="noopener noreferrer"
    >
      Mazda Digital Certified Retail
    </a>
    {' '}provider for Mazda dealerships nationwide.
  </p>
)

export const AkidoDescription: React.FC = () => (
    <p>
        Worked across a multi-repository, FHIR-based clinical platform, building
        TypeScript features in Next.js and React and in NestJS and Node.js services
        backed by GraphQL, PostgreSQL, and Kafka. Used Codex alongside Claude Code CLI
        configured through Amazon Bedrock, with MCP integrations, to build reusable
        skills and multi-step agent workflows for code changes and debugging. Applied
        validation and retry loops when consistency mattered and kept AI usage lean
        through deliberate context and token control.
    </p>
)

export const EngrainDescription: React.FC = () => (
    <p>
        Cut CI build time from 46 minutes to 20 minutes, a 57% reduction, by changing
        the test strategy and allocating build resources more efficiently. Used
        Codex CLI, Claude Code CLI, and GitHub Copilot CLI with MCP integrations and
        structured prompts for codebase research, implementation planning, debugging,
        and test design. Built full-stack features with Laravel, React, Redux, MySQL,
        and REST APIs and improved deployment reliability through CI/CD and container
        workflows.
    </p>
)

export const SeniorEngineerDescription: React.FC = () => (
    <p>
        Promoted three times, moving from help desk and QA into a senior engineering
        role. Built inventory and pricing integrations for Amazon Autos and improved
        React UI load times by up to 50% through shared component libraries and
        performance work. Built CRM and credit-application integrations and mentored
        teammates through pairing and code reviews.
    </p>
)

export const EngineerDescription: React.FC = () => (
    <p>
        Modernized legacy application code to improve maintainability and performance
        while contributing to architectural decisions. Designed and implemented REST
        API integrations and collaborated with QA and engineering peers through code
        reviews.
    </p>
)

export const JuniorEngineerDescription: React.FC = () => (
    <p>
        Delivered small features independently, contributed to larger team projects,
        and helped debug complex application issues. Built practical experience with
        deployment processes, continuous integration, and full-stack product development.
    </p>
)

export const HelpDeskDescription: React.FC = () => (
    <p>
        Diagnosed client issues, provided technical support, and translated findings
        into detailed, reproducible bug reports. Tested new features and collaborated
        with developers to resolve defects and improve software reliability.
    </p>
)
