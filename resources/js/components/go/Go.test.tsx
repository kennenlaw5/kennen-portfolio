import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import GoGame from 'Components/go/Go'

describe('Square Off Pro controls', () => {
    it('undoes the latest move with Ctrl+Z', async () => {
        const user = userEvent.setup()

        render(<GoGame />)

        const firstSquare = screen.getAllByRole('button', {name: ''})[0]

        await user.click(firstSquare)

        expect(screen.getByRole('button', {name: /^Undo/})).toBeEnabled()

        await user.keyboard('{Control>}z{/Control}')

        expect(screen.queryByRole('button', {name: /^Undo/})).not.toBeInTheDocument()

        await user.click(firstSquare)

        expect(screen.getByRole('button', {name: /^Undo/})).toBeEnabled()
    })
})
