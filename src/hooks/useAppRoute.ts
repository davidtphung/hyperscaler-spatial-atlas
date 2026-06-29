import { useCallback, useEffect, useState } from 'react'
import { parseAppRoute, routeToHash, type AppRoute } from '../utils/routes'

export function useAppRoute(): [AppRoute, (route: AppRoute) => void] {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseAppRoute(window.location.hash) : 'map'
  )

  useEffect(() => {
    const onHashChange = () => setRoute(parseAppRoute(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((next: AppRoute) => {
    const hash = routeToHash(next)
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute(next)
    }
  }, [])

  return [route, navigate]
}