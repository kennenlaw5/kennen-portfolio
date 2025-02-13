import React, {lazy, useState} from 'react'
import classNames from 'classnames'
import Section from 'Components/Section'
import {FaArrowLeft} from 'react-icons/fa'
import {TfiLayoutGrid4Alt} from 'react-icons/tfi'
import {GAMES} from 'Constants/gameConsts'
import {TGames} from 'JS/types/gameTypes'
import styles from 'Sass/modules/Games.module.scss'

const GoGame = lazy(() => import('Components/go/Go'))
const TicTacToe = lazy(() => import('Components/TicTacToe/TicTacToe'))

const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<TGames | null>(null)

  const handleBack = () => {
    setSelectedGame(null)
  }

  return selectedGame ? (
    <Section>
      <div className={styles.gamesHeader}>
        <button
          onClick={handleBack}
          className={styles.gamesBackButton}
          aria-label="Go back to game selection"
        >
          <FaArrowLeft />
        </button>
        <h2>{selectedGame}</h2>
      </div>
      <div>
        {selectedGame === GAMES.TIC_TAC_TOE ? <TicTacToe /> : <GoGame />}
      </div>
    </Section>
  ) : (
    <Section>
      <h2 className={styles.gamesTitle}>Games</h2>
      <div className={styles.gamesGrid}>
        {/* Tic Tac Toe Option */}
        <button
          onClick={() => setSelectedGame(GAMES.TIC_TAC_TOE)}
          className={styles.gamesOption}
        >
          <div className={styles.gamesOptionContent}>
            <img src="/svg/tic-tac-toe.svg" alt="Tic-Tac-Toe Logo" className={styles.gamesOptionImage} />
            <span className={styles.gamesOptionTitle}>{GAMES.TIC_TAC_TOE}</span>
          </div>
        </button>

        {/* Square Off Pro Option */}
        <button
          onClick={() => setSelectedGame(GAMES.SQUARE_OFF_PRO)}
          className={styles.gamesOption}
        >
          <div className={styles.gamesOptionContent}>
            <span className={styles.gamesOptionIcon}>
              <TfiLayoutGrid4Alt className={classNames(
                styles.gamesOptionIconHalf,
                styles.gamesOptionIconTopLeft
              )} />
              <TfiLayoutGrid4Alt className={classNames(
                styles.gamesOptionIconHalf,
                styles.gamesOptionIconBottomRight
              )} />
            </span>
            <span className={styles.gamesOptionTitle}>{GAMES.SQUARE_OFF_PRO}</span>
          </div>
        </button>
      </div>
    </Section>
  )
}

export default Games
