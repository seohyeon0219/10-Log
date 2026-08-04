import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '../constants/breakpoints'

const DESKTOP_QUERY = `(min-width: ${BREAKPOINTS.md}px)`

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}
