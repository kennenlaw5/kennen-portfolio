import {describe, expect, it} from 'vitest'
import {DIFFICULTIES, GAME_MODES} from 'Constants/gameConsts'
import {
    initialState as ticTacToeInitialState,
    reducer as ticTacToeReducer,
} from 'Components/TicTacToe/context/TicTacToeContext'
import {
    initialState as goInitialState,
    reducer as goReducer,
} from 'Components/go/context/GoGameContext'

describe('game reducers', () => {
    it('resets Tic Tac Toe while preserving player settings', () => {
        const state = {
            ...ticTacToeInitialState,
            board: ['X', 'O', 'X', '', '', '', '', '', ''],
            difficulty: DIFFICULTIES.HARD,
            gameMode: GAME_MODES.PERSON,
            isGameActive: true,
            winner: 'X' as const,
        }

        const nextState = ticTacToeReducer(state, {type: 'RESET_GAME'})

        expect(nextState.board).toEqual(Array(9).fill(''))
        expect(nextState.difficulty).toBe(DIFFICULTIES.HARD)
        expect(nextState.gameMode).toBe(GAME_MODES.PERSON)
        expect(nextState.isGameActive).toBe(false)
        expect(nextState.winner).toBeNull()
    })

    it('resets Square Off Pro while preserving game settings', () => {
        const state = {
            ...goInitialState,
            currentMove: 4,
            difficulty: DIFFICULTIES.HARD,
            previousMoveOffset: 2,
            versus: GAME_MODES.COMPUTER,
        }

        const nextState = goReducer(state, {type: 'RESET_BOARD'})

        expect(nextState.currentMove).toBe(0)
        expect(nextState.difficulty).toBe(DIFFICULTIES.HARD)
        expect(nextState.previousMoveOffset).toBe(2)
        expect(nextState.versus).toBe(GAME_MODES.COMPUTER)
    })
})
