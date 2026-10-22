import React from 'react'
import classNames from 'classnames'
import styles from 'Sass/modules/Backdrop.module.scss'

const Backdrop: React.FC = () => (
    <div aria-hidden="true" className={styles.backdrop}>
        <div className={styles.backdropGrid} />
        <div className={classNames(styles.backdropGlow, styles.backdropGlowPrimary)} />
        <div className={classNames(styles.backdropGlow, styles.backdropGlowSecondary)} />
    </div>
)

export default Backdrop
