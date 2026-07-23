import React from 'react'
import {fireEvent, render, screen, within} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import Experience from 'JS/pages/experience/Experience'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

vi.mock('JS/analytics', () => ({
    ANALYTICS_EVENTS: {RESUME_DOWNLOAD: 'resume_download'},
    trackEvent: vi.fn(),
}))

describe('Experience resume download', () => {
    it('uses the native resume download endpoint', () => {
        render(<Experience />)

        const link = screen.getByRole('link', {name: 'Download My Resume'})

        expect(link).toHaveAttribute('href', '/resume/download')
        expect(link).not.toHaveAttribute('download')
        expect(link).not.toHaveAttribute('target')

        link.addEventListener('click', event => event.preventDefault())
        fireEvent.click(link)
        expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.RESUME_DOWNLOAD)
    })
})

describe('Experience highlighted skills', () => {
    it('associates on-call tooling with Akido and AWS SQS with A2Z Sync', () => {
        render(<Experience />)

        const akidoProject = screen
            .getByRole('link', {name: 'Akido Labs — Clinical Platform and AI-Assisted Engineering'})
            .closest('div')
        const amazonAutosProject = screen
            .getByRole('link', {name: 'Amazon Autos'})
            .closest('div')

        expect(akidoProject).not.toBeNull()
        expect(amazonAutosProject).not.toBeNull()

        const akido = within(akidoProject as HTMLElement)
        const amazonAutos = within(amazonAutosProject as HTMLElement)
        const akidoOnCallSkills = ['Datadog', 'PagerDuty', 'Sentry', 'LogRocket', 'AWS CloudWatch']

        akidoOnCallSkills.forEach((skill) => {
            expect(akido.getByText(skill)).toBeInTheDocument()
        })
        expect(akido.getByText('Amazon Bedrock')).toBeInTheDocument()
        expect(akido.queryByText('LaunchDarkly')).not.toBeInTheDocument()

        expect(amazonAutos.getByText('AWS SQS')).toBeInTheDocument()
    })
})
