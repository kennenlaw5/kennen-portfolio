import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import {afterEach} from 'vitest'

afterEach(() => {
    cleanup()
})

window.APP_CONFIG = {
    phone: '555-555-5555',
    email: 'kennen@example.com',
    linkedin_url: 'https://www.linkedin.com/in/kennen-lawrence',
    github_url: 'https://github.com/kennenlaw5',
    city: 'Denver',
    state_abbreviation: 'CO',
}
