export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const el = document.getElementById('sr-announcer')
  if (!el) return
  el.setAttribute('aria-live', priority)
  el.textContent = ''
  requestAnimationFrame(() => {
    el.textContent = message
  })
}

export function formatShortcut(keys: string[]): string {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
  return keys.map((k) => (k === 'mod' ? (isMac ? '⌘' : 'Ctrl') : k)).join(isMac ? '' : '+')
}