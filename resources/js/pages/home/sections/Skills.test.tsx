import React from 'react'
import {fireEvent, render, screen, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Skills from 'JS/pages/home/sections/Skills'

const expectedCatalogAdditions = [
    'Apollo GraphQL',
    'AWS CloudWatch',
    'AWS SQS',
    'Confluence',
    'Datadog',
    'Figma',
    'Flask',
    'GitLab',
    'Go',
    'LaunchDarkly',
    'LogRocket',
    'MSW',
    'Notion',
    'Okta',
    'OpenAPI/Swagger',
    'PagerDuty',
    'Pino',
    'Playwright',
    'Prisma',
    'Pydantic',
    'pytest',
    'React Testing Library',
    'Sentry',
    'Sequelize',
    'SonarQube',
    'SQLAlchemy',
    'Tailwind CSS',
    'TanStack Query',
    'Vitest',
    'Zod',
]

const developerToolingSkills = [
    'Bitbucket',
    'Confluence',
    'Datadog',
    'Git',
    'GitHub',
    'GitHub Actions',
    'GitLab',
    'Greptile',
    'Jira',
    'LogRocket',
    'PagerDuty',
    'Playwright',
    'pytest',
    'Sentry',
    'SonarQube',
    'Vitest',
]

describe('Skills', () => {
    it('exposes the active skill filter to assistive technology', () => {
        render(<Skills />)

        const filters = screen.getByRole('group', {name: 'Filter skills by category'})
        const allFilter = within(filters).getByRole('button', {name: 'All'})
        const toolingFilter = within(filters).getByRole('button', {name: 'Developer Tooling'})

        expect(allFilter).toHaveAttribute('aria-pressed', 'true')
        expect(toolingFilter).toHaveAttribute('aria-pressed', 'false')

        fireEvent.click(toolingFilter)

        expect(allFilter).toHaveAttribute('aria-pressed', 'false')
        expect(toolingFilter).toHaveAttribute('aria-pressed', 'true')
    })

    it('renders the curated catalog and filters developer tooling', () => {
        render(<Skills />)

        expectedCatalogAdditions.forEach((skill) => {
            expect(screen.getByText(skill)).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole('button', {name: 'Developer Tooling'}))

        developerToolingSkills.forEach((skill) => {
            expect(screen.getByText(skill)).not.toHaveClass('hidden')
        })

        expect(screen.getByText('Laravel')).toHaveClass('hidden')
        expect(screen.getByText('AWS CloudWatch')).toHaveClass('hidden')
    })
})
