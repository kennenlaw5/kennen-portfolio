import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Card.module.scss'
import {THeader} from 'Components/card/types/card'

type TCardHeaderProps = {
    header: THeader
    subHeader: THeader
}

const CardHeader: React.FC<TCardHeaderProps> = ({header, subHeader}) => {
    return header || subHeader 
        ? (
            <h4 className={classNames(styles.cardTitle, {'!font-normal': !header})}>
                {header || subHeader}
            </h4>
        ) : null
}

export default CardHeader
