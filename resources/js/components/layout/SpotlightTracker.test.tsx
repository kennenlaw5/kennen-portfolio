import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import SpotlightTracker from 'Components/layout/SpotlightTracker'

const renderSpotlights = () => render(
    <>
        <SpotlightTracker />
        <div data-spotlight data-testid="card">
            <span data-spotlight data-testid="skill">TypeScript</span>
        </div>
        <span data-testid="plain">Plain text</span>
    </>
)

const spotlightPosition = (element: HTMLElement) => ({
    x: element.style.getPropertyValue('--spotlight-x'),
    y: element.style.getPropertyValue('--spotlight-y'),
})

describe('SpotlightTracker', () => {
    it('positions the glow on every spotlight element under the mouse', () => {
        renderSpotlights()

        fireEvent.pointerMove(screen.getByTestId('skill'), {pointerType: 'mouse', clientX: 12, clientY: 8})

        expect(spotlightPosition(screen.getByTestId('skill'))).toEqual({x: '12px', y: '8px'})
        expect(spotlightPosition(screen.getByTestId('card'))).toEqual({x: '12px', y: '8px'})
    })

    it('keeps nested spotlights in step when the pointer is over their parent', () => {
        renderSpotlights()

        fireEvent.pointerMove(screen.getByTestId('card'), {pointerType: 'mouse', clientX: 30, clientY: 4})

        expect(spotlightPosition(screen.getByTestId('card'))).toEqual({x: '30px', y: '4px'})
        expect(spotlightPosition(screen.getByTestId('skill'))).toEqual({x: '30px', y: '4px'})
    })

    it('ignores touch and pen pointers', () => {
        renderSpotlights()

        fireEvent.pointerMove(screen.getByTestId('skill'), {pointerType: 'touch', clientX: 12, clientY: 8})
        fireEvent.pointerMove(screen.getByTestId('skill'), {pointerType: 'pen', clientX: 12, clientY: 8})

        expect(spotlightPosition(screen.getByTestId('skill'))).toEqual({x: '', y: ''})
    })

    it('leaves elements outside a spotlight untouched', () => {
        renderSpotlights()

        fireEvent.pointerMove(screen.getByTestId('plain'), {pointerType: 'mouse', clientX: 12, clientY: 8})

        expect(spotlightPosition(screen.getByTestId('plain'))).toEqual({x: '', y: ''})
        expect(spotlightPosition(screen.getByTestId('card'))).toEqual({x: '', y: ''})
    })

    it('stops tracking once unmounted', () => {
        const {unmount} = render(<SpotlightTracker />)
        const element = document.createElement('div')
        element.dataset.spotlight = ''
        document.body.append(element)

        unmount()
        fireEvent.pointerMove(element, {pointerType: 'mouse', clientX: 12, clientY: 8})

        expect(spotlightPosition(element)).toEqual({x: '', y: ''})
        element.remove()
    })
})
