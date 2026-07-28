import {useLayoutEffect, useState} from 'react'

const useElementHeight = (
    element: HTMLElement | null,
    enabled: boolean,
): number => {
    const [height, setHeight] = useState(0)

    useLayoutEffect(() => {
        if (
            element === null
            || !enabled
            || typeof ResizeObserver !== 'undefined'
        ) {
            return
        }

        setHeight(element.getBoundingClientRect().height)
    })

    useLayoutEffect(() => {
        if (
            element === null
            || !enabled
        ) {
            return
        }

        const measure = (): void => {
            setHeight(element.getBoundingClientRect().height)
        }

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', measure)

            return () => {
                window.removeEventListener('resize', measure)
            }
        }

        measure()
        const resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(element)

        return () => resizeObserver.disconnect()
    }, [element, enabled])

    return height
}

export default useElementHeight
