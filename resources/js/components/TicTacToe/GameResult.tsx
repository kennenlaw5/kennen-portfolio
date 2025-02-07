import React from 'react'
import WinnerAnnouncement from 'Components/TicTacToe/WinnerAnnouncement'
import TieAnnouncement from 'Components/TicTacToe/TieAnnouncement'

const GameResult: React.FC = () => (
    <>
        <WinnerAnnouncement />
        <TieAnnouncement />
    </>
)

export default GameResult
