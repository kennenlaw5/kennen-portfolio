import React, {useMemo} from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import classNames from 'classnames'
import {BOARD_STATUS_ID, COLORS} from 'Components/go/constants/GoGameConsts'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {TPlayerColor} from 'Components/go/types/GoGameTypes'
import {capitalize} from 'JS/helpers'

type TCurrentPlayerBoxProps = {
    color: TPlayerColor
}

const CurrentPlayerBox: React.FC<TCurrentPlayerBoxProps> = ({color}) => (
    <div className={classNames(styles.gameTinyBox, {
        [styles.gameSquareRed]: color === COLORS.RED,
        [styles.gameSquareBlue]: color === COLORS.BLUE,
    })} />
)

const BoardStatus: React.FC = () => {
    const {
        state: {
            winner,
            nextColor,
            currentMove,
            maxMoves
        }
    } = useGoGameContext()
    const isGameOver = winner || currentMove === maxMoves
    const statusText = useMemo(() => {
        if (!isGameOver) {
            return `Next player: ${capitalize(nextColor)}`
        }

        return winner ? `Winner: ${capitalize(winner)}` : 'Tied game!'
    }, [isGameOver, nextColor, winner])

    return (
        <div
            id={BOARD_STATUS_ID}
            className={classNames(
                styles.gameStatus,
                'inline-flex items-center justify-center gap-2'
            )}
        >
            <span className={classNames({'font-bold': isGameOver})}>{statusText}</span>
            {!isGameOver || winner ? (
                <span aria-hidden="true">
                    <CurrentPlayerBox color={winner || nextColor} />
                </span>
            ) : null}
        </div>
    )
}

export default BoardStatus
