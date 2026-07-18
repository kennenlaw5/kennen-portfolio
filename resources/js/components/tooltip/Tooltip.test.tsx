import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import Tooltip from 'Components/tooltip/Tooltip'
import TooltipText from 'Components/tooltip/TooltipText'
import TooltipTrigger from 'Components/tooltip/TooltipTrigger'

describe('Tooltip', () => {
    it('shows on keyboard focus and dismisses with Escape', async () => {
        const user = userEvent.setup()

        render(
            <Tooltip>
                <TooltipTrigger>Highlighted Skills</TooltipTrigger>
                <TooltipText>Key highlights, not a comprehensive list.</TooltipText>
            </Tooltip>
        )

        const trigger = screen.getByRole('button', {name: 'Highlighted Skills'})
        const tooltip = screen.getByRole('tooltip', {hidden: true})

        expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)
        expect(tooltip).toHaveAttribute('aria-hidden', 'true')

        await user.tab()

        expect(trigger).toHaveFocus()
        expect(tooltip).toHaveAttribute('aria-hidden', 'false')

        await user.keyboard('{Escape}')

        expect(trigger).not.toHaveFocus()
        expect(tooltip).toHaveAttribute('aria-hidden', 'true')
    })
})
