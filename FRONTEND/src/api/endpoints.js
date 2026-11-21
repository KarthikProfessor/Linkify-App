import { api } from './client'

const unwrap = (res) => res.data.data

export const authApi = {
  register: (body) => api.post('/auth/register', body).then(unwrap),
  login: (body) => api.post('/auth/login', body).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
  logout: () => api.post('/auth/logout')
}

// Supports both the fixed controller shape ({ data: urls, pagination })
// and the service shape ({ data: { urls, pagination } }).
function normalizeUrlList(body) {
  const d = body?.data
  if (Array.isArray(d)) return { urls: d, pagination: body.pagination ?? null }
  return { urls: d?.urls ?? [], pagination: d?.pagination ?? body?.pagination ?? null }
}

export const urlApi = {
  create: (body) => api.post('/urls/shorten', body).then(unwrap),
  list: (page = 1, limit = 10) =>
    api.get('/urls', { params: { page, limit } }).then((res) => normalizeUrlList(res.data)),
  get: (id) => api.get(`/urls/${id}`).then(unwrap),
  update: (id, body) => api.put(`/urls/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/urls/${id}`)
}

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard').then(unwrap),
  topLinks: (limit = 5) => api.get('/analytics/top-links', { params: { limit } }).then(unwrap),
  summary: (urlId) => api.get(`/analytics/urls/${urlId}/summary`).then(unwrap),
  history: (urlId, days = 30) =>
    api.get(`/analytics/urls/${urlId}/history`, { params: { days } }).then(unwrap),
  breakdown: (urlId) => api.get(`/analytics/urls/${urlId}/breakdown`).then(unwrap)
}
