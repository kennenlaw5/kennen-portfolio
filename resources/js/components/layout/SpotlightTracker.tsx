import React, {useEffect} from 'react'

const SPOTLIGHT_SELECTOR = '[data-spotlight]'

/**
 * Maps the pointer into an element's own coordinates, undoing any transform such as a hover scale
 * so the glow stays under the cursor.
 */
const setSpotlightPosition = (element: HTMLElement, event: PointerEvent) => {
    const rect = element.getBoundingClientRect()
    const scaleX = rect.width ? element.offsetWidth / rect.width : 1
    const scaleY = rect.height ? element.offsetHeight / rect.height : 1

    element.style.setProperty('--spotlight-x', `${(event.clientX - rect.left) * scaleX}px`)
    element.style.setProperty('--spotlight-y', `${(event.clientY - rect.top) * scaleY}px`)
}

/**
 * Writes the mouse position into the outermost `[data-spotlight]` element under the pointer and
 * every spotlight nested inside it, as the `--spotlight-x` and `--spotlight-y` custom properties
 * that center their glows. Nested spotlights, such as a button's label, stay in step even while the
 * pointer is over the surrounding padding.
 */
const updateSpotlights = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) {
        return
    }

    let root = event.target.closest<HTMLElement>(SPOTLIGHT_SELECTOR)

    if (!root) {
        return
    }

    let parent = root.parentElement?.closest<HTMLElement>(SPOTLIGHT_SELECTOR)

    while (parent) {
        root = parent
        parent = root.parentElement?.closest<HTMLElement>(SPOTLIGHT_SELECTOR)
    }

    setSpotlightPosition(root, event)
    root.querySelectorAll<HTMLElement>(SPOTLIGHT_SELECTOR).forEach(element => {
        setSpotlightPosition(element, event)
    })
}

/**
 * One delegated listener drives the cursor-follow glow for the whole page; touch and pen input
 * are ignored because they have no hover position to follow.
 */
const SpotlightTracker: React.FC = () => {
    useEffect(() => {
        document.addEventListener('pointermove', updateSpotlights, {passive: true})

        return () => document.removeEventListener('pointermove', updateSpotlights)
    }, [])

    return null
}

export default SpotlightTracker
