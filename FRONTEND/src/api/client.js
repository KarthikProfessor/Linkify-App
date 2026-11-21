import axios from 'axios'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1').replace(/\/+$/, '')

const TOKEN_KEY = 'linkify_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable (private mode etc.) – session will just not persist */
  }
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// When a logged-in request comes back 401 (expired / invalid token), log the user out
let unauthorizedHandler = null
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  }
)

/** Turn any API / network error into a human readable message. */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') return 'The server took too long to respond.'
    return "Can't reach the server. Make sure the API is running."
  }

  const data = error.response.data

  // express-validator errors: { success:false, errors:[{ msg, path }] }
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((e) => e.msg).join(' · ')
  }

  if (typeof data?.message === 'string') return data.message
  if (typeof data === 'string' && data.length < 200) return data

  return fallback
}

/** Map express-validator errors to { fieldName: message } for inline form errors. */
export function getFieldErrors(error) {
  const list = error?.response?.data?.errors
  if (!Array.isArray(list)) return {}
  return list.reduce((acc, e) => {
    const key = e.path || e.param
    if (key && !acc[key]) acc[key] = e.msg
    return acc
  }, {})
}
