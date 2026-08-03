import React, {lazy, Suspense, useEffect, useRef, useState} from 'react'
import Section from 'Components/Section'
import ExperimentCard from 'Components/games/ExperimentCard'
import LoadingIndicator from 'Components/layout/LoadingIndicator'
import {FaArrowLeft} from 'react-icons/fa'
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
    const experimentHeading = useRef<HTMLHeadingElement>(null)
    const experimentButtons = useRef<Partial<Record<TGames, HTMLButtonElement | null>>>({})
    const focusReturnTarget = useRef<TGames | null>(null)
    const selectedExperiment = selectedGame ? EXPERIMENTS[selectedGame] : null

    useEffect(() => {
        if (selectedGame === GAMES.SQUARE_OFF_PRO) {
            experimentHeading.current?.focus()
            return
        }

        if (focusReturnTarget.current) {
            experimentButtons.current[focusReturnTarget.current]?.focus()
            focusReturnTarget.current = null
        }
    }, [selectedGame])

    const handleOpen = (game: TGames) => {
        focusReturnTarget.current = game === GAMES.SQUARE_OFF_PRO ? game : null
        setSelectedGame(game)
    }

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
                    <h2
                        ref={selectedGame === GAMES.SQUARE_OFF_PRO
                            ? experimentHeading
                            : undefined}
                        tabIndex={selectedGame === GAMES.SQUARE_OFF_PRO ? -1 : undefined}
                    >
                        {selectedGame}
                    </h2>
                </div>
            </div>
            <div className={styles.gamesExperimentContext}>
                <p className={styles.gamesDescription}>{selectedExperiment?.description}</p>
                <span
                    className={styles.gamesConcepts}
                    role="list"
                    aria-label={`${selectedGame} engineering concepts`}
                >
                    {selectedExperiment?.concepts.map(concept => (
                        <span className={styles.gamesConcept} role="listitem" key={concept}>
                            {concept}
                        </span>
                    ))}
                </span>
            </div>
            {selectedGame === GAMES.TIC_TAC_TOE ? (
                <div>
                    <TicTacToe />
                </div>
            ) : (
                <Suspense fallback={(
                    <LoadingIndicator
                        label={`Loading ${selectedGame} experiment`}
                        className="min-h-[50svh] w-full"
                    />
                )}>
                    <div>
                        <GoGame />
                    </div>
                </Suspense>
            )}
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
                {Object.values(GAMES).map(game => (
                    <ExperimentCard
                        key={game}
                        game={game}
                        description={EXPERIMENTS[game].description}
                        concepts={EXPERIMENTS[game].concepts}
                        buttonRef={button => {
                            experimentButtons.current[game] = button
                        }}
                        onOpen={() => handleOpen(game)}
                    />
                ))}
            </div>
        </Section>
    )
}

export default Games
