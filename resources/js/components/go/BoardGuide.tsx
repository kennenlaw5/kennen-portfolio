import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/GoGame.module.scss'
import {BOARD_INSTRUCTIONS_ID, COLORS} from 'Components/go/constants/GoGameConsts'
import {capitalize} from 'JS/helpers'

const BoardGuide: React.FC = () => (
    <section className={styles.gameGuide} aria-labelledby="square-off-board-guide-heading">
        <h3 id="square-off-board-guide-heading" className={styles.gameGuideHeading}>Board controls</h3>
        <p id={BOARD_INSTRUCTIONS_ID} className={styles.gameGuideInstructions}>
            Tab enters the board once. Use the arrow keys to move between squares, Home and End to move within a row,
            and Ctrl+Home or Ctrl+End to reach the first or last square. Press Enter or Space to claim an empty square.
            Press Ctrl+Z or Command+Z to undo the latest turn.
        </p>
        <ul className={styles.gameLegend} aria-label="Square ownership legend">
            {Object.values(COLORS).map(color => (
                <li className={styles.gameLegendItem} key={color}>
                    <span className={classNames(styles.gameMarker, {
                        [styles.gameMarkerRed]: color === COLORS.RED,
                        [styles.gameMarkerBlue]: color === COLORS.BLUE,
                    })} aria-hidden="true">
                        {color.charAt(0).toUpperCase()}
                    </span>
                    <span>{capitalize(color)}</span>
                </li>
            ))}
        </ul>
    </section>
)

export default BoardGuide
