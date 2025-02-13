import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/GoGame.module.scss'
import {COLORS} from 'Components/go/constants/GoGameConsts'
import {useGoGameContext} from 'Components/go/context/GoGameContext'

type TSquareProps = {
    rowIndex: number
    columnIndex: number
}

const Square: React.FC<TSquareProps> = ({rowIndex, columnIndex}) => {
    const {state, dispatch} = useGoGameContext()
    const {nextColor, squares, winner, isPlayerTurn} = state
    const currentColor = squares[rowIndex][columnIndex]
    const shouldFadeSquare = winner && winner !== currentColor

    const handleClick = () => {
        if (currentColor || winner || !isPlayerTurn) {
            return
        }

        dispatch({
            type: 'SET_SQUARE',
            row: rowIndex,
            column: columnIndex,
        })
    }

    return (
        <button
            className={classNames(styles.gameSquare, {
                [styles.gameSquareRed]: currentColor === COLORS.RED,
                [styles.gameSquareBlue]: currentColor === COLORS.BLUE,
                [styles.gameSquareRedHover]: !currentColor && nextColor === COLORS.RED,
                [styles.gameSquareBlueHover]: !currentColor && nextColor === COLORS.BLUE,
                [styles.gameSquareFade]: shouldFadeSquare,
            })}
            onClick={handleClick}
        />
    )
}

export default Square
