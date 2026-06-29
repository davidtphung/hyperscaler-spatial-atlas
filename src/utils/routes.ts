export type AppRoute = 'map' | 'about' | 'sources'

export function parseAppRoute(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\//, '')
  if (path === 'about') return 'about'
  if (path === 'sources') return 'sources'
  return 'map'
}

export function routeToHash(route: AppRoute): string {
  if (route === 'map') return ''
  return `#/${route}`
}

export function routeHref(route: AppRoute): string {
  const base = import.meta.env.BASE_URL
  const hash = routeToHash(route)
  return `${base}${hash}`
}