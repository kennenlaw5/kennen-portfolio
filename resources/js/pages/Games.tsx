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

type TExperiment = {
  description: string
  concepts: string[]
}

const EXPERIMENTS: Record<TGames, TExperiment> = {
  [GAMES.TIC_TAC_TOE]: {
    description: 'A compact state-modeling exercise built around typed reducer actions and Context. Turn sequencing, win detection, player configuration, and difficulty-based computer choices are separated from presentation for focused tests.',
    concepts: ['Reducer + Context', 'Typed State', 'Rule Evaluation', 'Difficulty Logic'],
  },
  [GAMES.SQUARE_OFF_PRO]: {
    description: 'Square Off Pro is a turn-based territory game played on a 10×10 board. Players claim empty squares, surround opposing pieces to convert them, and compete to control the most spaces when the board is full. Reducer-driven rules, move history, live scoring, and adjustable computer difficulty make its complex state transitions easier to reason about and test.',
    concepts: ['Custom Rule Engine', 'Move History', 'Heuristic AI', 'Testable State'],
  },
}

const Games: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<TGames | null>(null)
  const selectedExperiment = selectedGame ? EXPERIMENTS[selectedGame] : null

  const handleBack = () => {
    setSelectedGame(null)
  }

  return selectedGame ? (
    <Section>
      <div className={styles.gamesHeader}>
        <button
          onClick={handleBack}
          className={styles.gamesBackButton}
        >
          <FaArrowLeft aria-hidden="true" />
          <span>Back to experiments</span>
        </button>
        <div>
          <span className={styles.gamesEyebrow}>Engineering Lab experiment</span>
          <h2>{selectedGame}</h2>
        </div>
      </div>
      <div className={styles.gamesExperimentContext}>
        <p className={styles.gamesDescription}>{selectedExperiment?.description}</p>
        <span className={styles.gamesConcepts} role="list" aria-label={`${selectedGame} engineering concepts`}>
          {selectedExperiment?.concepts.map(concept => (
            <span className={styles.gamesConcept} role="listitem" key={concept}>{concept}</span>
          ))}
        </span>
      </div>
      <div>
        {selectedGame === GAMES.TIC_TAC_TOE ? <TicTacToe /> : <GoGame />}
      </div>
    </Section>
  ) : (
    <Section>
      <header className={styles.gamesIntro}>
        <span className={styles.gamesEyebrow}>Interactive systems, explained</span>
        <h2 className={styles.gamesTitle}>Engineering Lab</h2>
        <p className={styles.gamesDescription}>
          These playable experiments turn frontend architecture into something you can interact with.
          Each isolates state transitions, domain rules, and computer decision-making so the behavior
          stays understandable and testable.
        </p>
      </header>
      <div className={styles.gamesGrid}>
        {/* Tic Tac Toe Experiment */}
        <article
          className={styles.gamesOption}
          aria-labelledby="tic-tac-toe-experiment-title"
        >
          <div className={styles.gamesOptionContent}>
            <span className={styles.gamesOptionVisual}>
              <img src="/svg/tic-tac-toe.svg" alt="" className={styles.gamesOptionImage} />
            </span>
            <h3 id="tic-tac-toe-experiment-title" className={styles.gamesOptionTitle}>
              {GAMES.TIC_TAC_TOE}
            </h3>
            <span className={styles.gamesOptionDescription}>{EXPERIMENTS[GAMES.TIC_TAC_TOE].description}</span>
            <span className={styles.gamesConcepts} role="list" aria-label="Tic Tac Toe engineering concepts">
              {EXPERIMENTS[GAMES.TIC_TAC_TOE].concepts.map(concept => (
                <span className={styles.gamesConcept} role="listitem" key={concept}>{concept}</span>
              ))}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedGame(GAMES.TIC_TAC_TOE)}
            className={styles.gamesOptionButton}
            aria-label={`Open ${GAMES.TIC_TAC_TOE} experiment`}
          />
        </article>

        {/* Square Off Pro Experiment */}
        <article
          className={styles.gamesOption}
          aria-labelledby="square-off-pro-experiment-title"
        >
          <div className={styles.gamesOptionContent}>
            <span className={styles.gamesOptionVisual}>
              <span className={styles.gamesOptionIcon}>
                <TfiLayoutGrid4Alt className={classNames(
                  styles.gamesOptionIconHalf,
                  styles.gamesOptionIconTopLeft
                )} aria-hidden="true" />
                <TfiLayoutGrid4Alt className={classNames(
                  styles.gamesOptionIconHalf,
                  styles.gamesOptionIconBottomRight
                )} aria-hidden="true" />
              </span>
            </span>
            <h3 id="square-off-pro-experiment-title" className={styles.gamesOptionTitle}>
              {GAMES.SQUARE_OFF_PRO}
            </h3>
            <span className={styles.gamesOptionDescription}>{EXPERIMENTS[GAMES.SQUARE_OFF_PRO].description}</span>
            <span className={styles.gamesConcepts} role="list" aria-label="Square Off Pro engineering concepts">
              {EXPERIMENTS[GAMES.SQUARE_OFF_PRO].concepts.map(concept => (
                <span className={styles.gamesConcept} role="listitem" key={concept}>{concept}</span>
              ))}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedGame(GAMES.SQUARE_OFF_PRO)}
            className={styles.gamesOptionButton}
            aria-label={`Open ${GAMES.SQUARE_OFF_PRO} experiment`}
          />
        </article>
      </div>
    </Section>
  )
}

export default Games
