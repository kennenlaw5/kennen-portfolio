import React from 'react'
import {FaChevronDown} from 'react-icons/fa'
import styles from 'Sass/modules/GoGame.module.scss'

const captureRequirements = [
    {location: 'Interior square', neighbors: 'Four matching neighbors'},
    {location: 'Edge square', neighbors: 'Three matching neighbors'},
    {location: 'Corner square', neighbors: 'Two matching neighbors'},
]

const SquareOffRules: React.FC = () => (
    <details className={styles.gameRules}>
        <summary className={styles.gameRulesSummary}>
            <span>
                <span className={styles.gameRulesSummaryTitle}>How to play</span>
                <span className={styles.gameRulesSummaryDescription}>Claim, surround, and control the board</span>
            </span>
            <FaChevronDown className={styles.gameRulesIcon} aria-hidden="true" />
        </summary>
        <section
            className={styles.gameRulesContent}
            aria-labelledby="square-off-rules-heading"
        >
            <h3 id="square-off-rules-heading" className={styles.gameRulesHeading}>Square Off Pro rules</h3>
            <p className={styles.gameRulesIntro}>
                Build territory one turn at a time, then use the board&apos;s geometry to take control of surrounded pieces.
            </p>

            <ol className={styles.gameRulesSteps} aria-label="How a turn works">
                <li className={styles.gameRulesStep}>
                    <span className={styles.gameRulesStepNumber} aria-hidden="true">1</span>
                    <div>
                        <h4 className={styles.gameRulesStepTitle}>Claim a square</h4>
                        <p>Red goes first. On each turn, choose one empty square and claim it with your color.</p>
                    </div>
                </li>
                <li className={styles.gameRulesStep}>
                    <span className={styles.gameRulesStepNumber} aria-hidden="true">2</span>
                    <div>
                        <h4 className={styles.gameRulesStepTitle}>Surround an opponent</h4>
                        <p>
                            An opponent&apos;s square changes to your color when every available straight neighbor—above,
                            below, left, and right—is yours.
                        </p>
                    </div>
                </li>
                <li className={styles.gameRulesStep}>
                    <span className={styles.gameRulesStepNumber} aria-hidden="true">3</span>
                    <div>
                        <h4 className={styles.gameRulesStepTitle}>Control the full board</h4>
                        <p>
                            Each square you control is worth one point. When all 100 squares are claimed, the higher
                            score wins; equal scores end in a tie.
                        </p>
                    </div>
                </li>
            </ol>

            <div className={styles.gameRulesCapture}>
                <h4 className={styles.gameRulesSubheading}>What counts as surrounded?</h4>
                <ul className={styles.gameRulesCaptureGrid} aria-label="Capture requirements">
                    {captureRequirements.map(({location, neighbors}) => (
                        <li className={styles.gameRulesCaptureCard} key={location}>
                            <span className={styles.gameRulesCaptureLocation}>{location}</span>
                            <span>{neighbors}</span>
                        </li>
                    ))}
                </ul>
                <p className={styles.gameRulesNote}>
                    The edge of the board acts as a closed side. Diagonals never count toward a capture.
                </p>
                <div className={styles.gameRulesOverlap}>
                    <h4 className={styles.gameRulesSubheading}>When traps overlap</h4>
                    <p>
                        <strong>Captures from your move resolve first.</strong> If you place a square inside an
                        opponent&apos;s existing trap and that same move completes your own trap around one of their
                        squares, your capture happens before their trap is checked.
                    </p>
                    <p>
                        When the square you capture is one of the pieces surrounding your new move, changing it to your
                        color breaks their trap, so your new square stays yours. If their surrounding shape remains
                        intact, their trap resolves next and changes your new square to their color.
                    </p>
                </div>
            </div>

            <div className={styles.gameRulesControls}>
                <h4 className={styles.gameRulesSubheading}>Modes and controls</h4>
                <p>
                    You play by the same rules in Person and Computer modes. Difficulty changes the opponent, not how
                    captures or scoring work.
                </p>
                <p>
                    Before the board is full, use <strong>Undo</strong> or press <strong>Ctrl+Z</strong> (Command+Z on
                    macOS) to rewind one move in Person mode or the latest human-and-computer turn pair in Computer
                    mode. <strong>Reset</strong> clears the board while keeping the selected mode and difficulty.
                </p>
            </div>
        </section>
    </details>
)

export default SquareOffRules
