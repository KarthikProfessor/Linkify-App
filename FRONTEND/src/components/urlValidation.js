// Mirrors the backend's urlValidator so users get instant feedback.
export const RESERVED_ALIASES = ['api', 'login', 'register', 'logout', 'dashboard', 'analytics', 'health', 'admin']

export function validateOriginalUrl(value) {
  const v = value.trim()
  if (!v) return 'Please enter a URL'
  try {
    const u = new URL(v)
    if (!['http:', 'https:'].includes(u.protocol)) return 'URL must start with http:// or https://'
    if (!u.hostname.includes('.')) return 'Please provide a valid Http or Https Url'
  } catch {
    return 'Please provide a valid URL, including http:// or https://'
  }
  return null
}

export function validateAlias(value) {
  const v = value.trim()
  if (!v) return null
  if (v.length < 3 || v.length > 20) return 'Alias must be between 3 and 20 characters'
  if (!/^[a-zA-Z0-9_-]+$/.test(v)) return 'Alias can only contain letters, numbers, hyphens and underscores'
  if (RESERVED_ALIASES.includes(v.toLowerCase())) return 'This alias is reserved'
  return null
}

export function validateExpiry(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Please provide a valid expiration date'
  if (d <= new Date()) return 'Expiration date must be in the future'
  return null
}
