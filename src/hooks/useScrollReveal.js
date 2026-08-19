import { useEffect, useRef } from 'react'

// Maps each ref's viewport entry progress (0 = just below the fold, 1 = fully
// settled) onto its --reveal CSS var, recomputed on every scroll frame so
// motion stays glued to the scroll position instead of firing a fixed transition.
// `delays[i]` (px) shifts element i's trigger window later, for staggering
// elements that sit at the same scroll position (e.g. a row of cards).
export function useScrollReveal(count, delays = []) {
  const refs = useRef(Array.from({ length: count }, () => null))

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      refs.current.forEach((node) => node?.style.setProperty('--reveal', 1))
      return
    }

    let frame = null

    const update = () => {
      frame = null
      const viewportHeight = window.innerHeight

      refs.current.forEach((node, i) => {
        if (!node) return
        const { top, height } = node.getBoundingClientRect()
        const d = delays[i] || 0
        const start = viewportHeight * 0.9 - d
        const end = viewportHeight * 0.55 - height * 0.3 - d
        const progress = (start - top) / (start - end)
        node.style.setProperty('--reveal', Math.min(1, Math.max(0, progress)))
      })
    }

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return refs.current
}
