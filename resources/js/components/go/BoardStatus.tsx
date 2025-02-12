import React, {useMemo} from 'react'
import styles from 'Sass/modules/GoGame.module.scss'
import classNames from 'classnames'
import {BOARD_DIMENSIONS, COLORS} from 'Components/go/constants/GoGameConsts'
import {useGoGameContext} from 'Components/go/context/GoGameContext'
import {TPlayerColor} from 'Components/go/types/GoGameTypes'

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
    const winnerText = useMemo(() => winner ? 'Winner: ' : 'Tied game!', [winner])

    return isGameOver ? (
        <div>
            <b>{winnerText}</b>
            {winner ? <CurrentPlayerBox color={winner} /> : null}
        </div>
    ) : (
        <div className='inline-flex justify-center'>
            <div className="my-auto">Next player:&nbsp;</div>
            <CurrentPlayerBox color={nextColor} />
        </div>
    )
}

export default BoardStatus
