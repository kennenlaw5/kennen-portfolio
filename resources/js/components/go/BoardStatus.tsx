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
    const winnerText = useMemo(() => winner ? 'Winner:' : 'Tied game!', [winner])

    return (
        <div className='inline-flex justify-center'>
            <div className={classNames('my-auto', {'font-bold': isGameOver})}>
                {isGameOver ? winnerText : 'Next Player:'}&nbsp;
            </div>
            {!isGameOver || winner ? <CurrentPlayerBox color={winner || nextColor} /> : null}
        </div>
    )
}

export default BoardStatus
