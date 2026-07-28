import {useLayoutEffect, useState} from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const prefersReducedMotion = (): boolean => (
    typeof window.matchMedia === 'function'
    && window.matchMedia(REDUCED_MOTION_QUERY).matches
)

const useReducedMotion = (): boolean => {
    const [reducedMotion, setReducedMotion] = useState(
        prefersReducedMotion,
    )

    useLayoutEffect(() => {
        if (typeof window.matchMedia !== 'function') {
            return
        }

        const query = window.matchMedia(REDUCED_MOTION_QUERY)
        const synchronize = (): void => {
            setReducedMotion(query.matches)
        }

        if (typeof query.addEventListener === 'function') {
            query.addEventListener('change', synchronize)

            return () => {
                query.removeEventListener('change', synchronize)
            }
        }

        query.addListener(synchronize)

        return () => {
            query.removeListener(synchronize)
        }
    }, [])

    return reducedMotion
}

export default useReducedMotion
