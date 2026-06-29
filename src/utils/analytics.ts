import type { AnalyticsEvent } from '../types'

type AnalyticsHandler = (event: AnalyticsEvent) => void

const handlers = new Set<AnalyticsHandler>()

export function trackEvent(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics]', event)
  }
  handlers.forEach((h) => h(event))
}

export function onAnalytics(handler: AnalyticsHandler): () => void {
  handlers.add(handler)
  return () => handlers.delete(handler)
}