const numberFmt = new Intl.NumberFormat()

export const formatNumber = (n) => numberFmt.format(Number(n) || 0)

export function formatDate(value, withTime = false) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  })
}

export function timeAgo(value) {
  if (!value) return 'Never'
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ]
  for (const [unit, secs] of units) {
    const v = Math.floor(seconds / secs)
    if (v >= 1) return `${v} ${unit}${v > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

/** "2026-11-03" -> "Nov 3" (treated as a UTC day, which is how the API groups clicks) */
export function formatDayLabel(isoDay) {
  const d = new Date(`${isoDay}T00:00:00Z`)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

/**
 * The API only returns days that have clicks. Fill the gaps with 0 so charts
 * show a continuous timeline for the last `days` days (UTC).
 */
export function fillDailySeries(points = [], days = 30) {
  const counts = new Map(points.map((p) => [p.date, p.clicks]))
  const today = new Date()
  const series = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i))
    const key = d.toISOString().slice(0, 10)
    series.push({ date: key, label: formatDayLabel(key), clicks: counts.get(key) ?? 0 })
  }
  return series
}

export function getUrlStatus(url) {
  if (!url) return 'unknown'
  if (url.expiresAt && new Date(url.expiresAt) <= new Date()) return 'expired'
  if (url.isActive === false) return 'inactive'
  return 'active'
}

/** ISO string -> value for <input type="datetime-local"> in local time */
export function toDateTimeLocal(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

export function stripProtocol(url = '') {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
