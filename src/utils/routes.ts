export type AppRoute =
  | 'dashboard'
  | 'timeline'
  | 'cloud'
  | 'review'
  | 'map'
  | 'compare'
  | 'forecasts'
  | 'sources'
  | 'about'

export function parseAppRoute(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\//, '')
  if (path === '' || path === 'dashboard') return 'dashboard'
  if (path === 'timeline') return 'timeline'
  if (path === 'cloud') return 'cloud'
  if (path === 'review') return 'review'
  if (path === 'map') return 'map'
  if (path === 'compare') return 'compare'
  if (path === 'forecasts') return 'forecasts'
  if (path === 'about') return 'about'
  if (path === 'sources') return 'sources'
  return 'dashboard'
}

export function routeToHash(route: AppRoute): string {
  if (route === 'dashboard') return '#/dashboard'
  if (route === 'map') return '#/map'
  return `#/${route}`
}

export function routeHref(route: AppRoute): string {
  const base = import.meta.env.BASE_URL
  return `${base}${routeToHash(route)}`
}