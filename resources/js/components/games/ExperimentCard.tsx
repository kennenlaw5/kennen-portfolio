import React from 'react'
import classNames from 'classnames'
import {TfiLayoutGrid4Alt} from 'react-icons/tfi'
import {GAMES} from 'Constants/gameConsts'
import {TGames} from 'JS/types/gameTypes'
import styles from 'Sass/modules/Games.module.scss'

type TExperimentCardProps = {
    game: TGames
    description: string
    concepts: string[]
    buttonRef: (button: HTMLButtonElement | null) => void
    onOpen: () => void
}

const ExperimentVisual: React.FC<{game: TGames}> = ({game}) => (
    <span className={styles.gamesOptionVisual}>
        {game === GAMES.TIC_TAC_TOE ? (
            <img src="/svg/tic-tac-toe.svg" alt="" className={styles.gamesOptionImage} />
        ) : (
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
        )}
    </span>
)

const ExperimentCard: React.FC<TExperimentCardProps> = ({
    game,
    description,
    concepts,
    buttonRef,
    onOpen,
}) => {
    const titleId = `${game.toLowerCase().replace(/ /g, '-')}-experiment-title`

    return (
        <article className={styles.gamesOption} aria-labelledby={titleId}>
            <div className={styles.gamesOptionContent}>
                <ExperimentVisual game={game} />
                <h3 id={titleId} className={styles.gamesOptionTitle}>{game}</h3>
                <span className={styles.gamesOptionDescription}>{description}</span>
                <span className={styles.gamesConcepts} role="list" aria-label={`${game} engineering concepts`}>
                    {concepts.map(concept => (
                        <span className={styles.gamesConcept} role="listitem" key={concept}>{concept}</span>
                    ))}
                </span>
            </div>
            <button
                type="button"
                ref={buttonRef}
                onClick={onOpen}
                className={styles.gamesOptionButton}
                aria-label={`Open ${game} experiment`}
            />
        </article>
    )
}

export default ExperimentCard
