import {describe, expect, it} from 'vitest'
import {handleMove} from 'Components/go/helpers'
import {initialState} from 'Components/go/context/GoGameContext'
import {BOARD_DIMENSIONS, COLORS} from 'Components/go/constants/GoGameConsts'
import {TBoard} from 'Components/go/types/GoGameTypes'

describe('Square Off Pro move resolution', () => {
    it('resolves the active player capture before the opponent overlapping trap', () => {
        const squares: TBoard = Array(BOARD_DIMENSIONS.ROWS).fill(null).map(() => Array(BOARD_DIMENSIONS.COLS).fill(null))

        squares[1][2] = COLORS.RED
        squares[2][1] = COLORS.RED
        squares[2][3] = COLORS.RED
        squares[3][2] = COLORS.RED
        squares[1][3] = COLORS.BLUE
        squares[2][4] = COLORS.BLUE
        squares[3][3] = COLORS.BLUE

        const nextSquares = handleMove({
            ...initialState,
            squares,
            nextColor: COLORS.BLUE,
            previousColor: COLORS.RED,
        }, 2, 2)

        expect(nextSquares[2][2]).toBe(COLORS.BLUE)
        expect(nextSquares[2][3]).toBe(COLORS.BLUE)
    })
})
