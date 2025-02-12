import React from 'react'
import Square from 'Components/go/Square'
import styles from 'Sass/modules/GoGame.module.scss'
import {useGoGameContext} from 'Components/go/context/GoGameContext'

type TBoardRowProps = {
    rowIndex: number
}

const BoardRow: React.FC<TBoardRowProps> = ({rowIndex}) => {
    const {state: {squares}} = useGoGameContext()

    
    return (
        <div className={styles.gameBoardRow}>
            {squares[rowIndex].map((_, columnIndex) => (
                <Square
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                    key={`${rowIndex},${columnIndex}`}
                />
            ))}
        </div>
    )
}

export default BoardRow
