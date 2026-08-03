import React, {useEffect, useRef} from 'react'
import {COLORS} from 'Components/go/constants/GoGameConsts'
import {
    useGameAnnouncement,
    useGameAnnouncer,
} from 'Components/go/context/GameAnnouncementContext'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {TGameState, TPlayerColor} from 'Components/go/types/GoGameTypes'
import {capitalize} from 'JS/helpers'

const getCaptureText = (
    previousState: TGameState,
    state: TGameState,
    player: TPlayerColor,
    row: number,
    column: number
) => {
    const previousSquares = previousState.squares.flat()
    const currentSquares = state.squares.flat()
    const opponent = state.nextColor
    const captureCount = previousSquares.filter((cell, index) => (
        cell !== null
        && cell !== player
        && currentSquares[index] === player
    )).length
    const counterCaptureCount = previousSquares.filter((cell, index) => (
        cell === player && currentSquares[index] === opponent
    )).length
    const playedSquareOwner = state.squares[row - 1][column - 1]
    const messages = []

    if (captureCount) {
        messages.push(`Captured ${captureCount} ${captureCount === 1 ? 'square' : 'squares'}.`)
    }

    if (playedSquareOwner && playedSquareOwner !== player) {
        messages.push(`${capitalize(playedSquareOwner)} captured the played square.`)
    }

    if (counterCaptureCount) {
        messages.push(
            `${capitalize(opponent)} captured ${counterCaptureCount} other ${counterCaptureCount === 1 ? 'square' : 'squares'}.`
        )
    }

    return messages.length ? ` ${messages.join(' ')}` : ''
}

const getMoveAnnouncement = (previousState: TGameState, state: TGameState) => {
    const location = state.previousMoves.locations[state.currentMove - 1]
    const player = state.previousColor
    const captureText = getCaptureText(previousState, state, player, location.row, location.column)
    const scoreText = ` Score: ${capitalize(COLORS.RED)} ${state.scores[COLORS.RED]}, ${capitalize(COLORS.BLUE)} ${state.scores[COLORS.BLUE]}.`

    if (state.currentMove === state.maxMoves) {
        const result = state.winner ? ` Winner: ${capitalize(state.winner)}.` : ' Tie game.'

        return `${capitalize(player)} played row ${location.row}, column ${location.column}.${captureText}${scoreText}${result}`
    }

    const turn = state.isPlayerTurn
        ? ` Next player: ${capitalize(state.nextColor)}.`
        : ' Computer turn.'

    return `${capitalize(player)} played row ${location.row}, column ${location.column}.${captureText}${scoreText}${turn}`
}

const LiveGameStatus: React.FC = () => {
    const {state} = useGoGameContext()
    const announcement = useGameAnnouncement()
    const announce = useGameAnnouncer()
    const previousState = useRef(state)

    useEffect(() => {
        if (state.currentMove > previousState.current.currentMove) {
            announce(getMoveAnnouncement(previousState.current, state))
        }

        previousState.current = state
    }, [announce, state])

    return (
        <p className="sr-only" role="status" aria-atomic="true">
            <span key={announcement.revision}>{announcement.message}</span>
        </p>
    )
}

export default LiveGameStatus
