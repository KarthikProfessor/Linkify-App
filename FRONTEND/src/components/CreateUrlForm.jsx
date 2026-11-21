import { useState } from 'react'
import { ChevronDown, Link2, Sparkles } from 'lucide-react'
import { urlApi } from '../api/endpoints'
import { getErrorMessage, getFieldErrors } from '../api/client'
import { useToast } from '../context/ToastContext'
import Spinner from './Spinner'
import CopyButton from './CopyButton'
import { validateAlias, validateExpiry, validateOriginalUrl } from './urlValidation'

const EMPTY = { originalUrl: '', customAlias: '', expiresAt: '' }

export default function CreateUrlForm({ onCreated }) {
  const toast = useToast()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [showOptions, setShowOptions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {
      originalUrl: validateOriginalUrl(form.originalUrl),
      customAlias: validateAlias(form.customAlias),
      expiresAt: validateExpiry(form.expiresAt)
    }
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors)
      if (nextErrors.customAlias || nextErrors.expiresAt) setShowOptions(true)
      return
    }

    const payload = { originalUrl: form.originalUrl.trim() }
    if (form.customAlias.trim()) payload.customAlias = form.customAlias.trim()
    if (form.expiresAt) payload.expiresAt = new Date(form.expiresAt).toISOString()

    setLoading(true)
    try {
      const url = await urlApi.create(payload)
      setCreated(url)
      setForm(EMPTY)
      setErrors({})
      toast.success('Short link created')
      onCreated?.(url)
    } catch (err) {
      const fieldErrors = getFieldErrors(err)
      if (err.response?.status === 409) fieldErrors.customAlias = getErrorMessage(err)
      setErrors(fieldErrors)
      if (fieldErrors.customAlias || fieldErrors.expiresAt) setShowOptions(true)
      if (!Object.keys(fieldErrors).length) toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="size-5 text-indigo-600" />
        <h2 className="text-base font-semibold text-slate-900">Shorten a link</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor="originalUrl" className="sr-only">
              Long URL
            </label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="originalUrl"
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="https://example.com/a/very/long/link"
                className={`input py-2.5 pl-9 ${errors.originalUrl ? 'input-error' : ''}`}
                value={form.originalUrl}
                onChange={(e) => update('originalUrl', e.target.value)}
              />
            </div>
            {errors.originalUrl && <p className="mt-1 text-xs text-red-600">{errors.originalUrl}</p>}
          </div>
          <button type="submit" className="btn-primary py-2.5 sm:w-auto" disabled={loading}>
            {loading && <Spinner className="size-4" />}
            Shorten
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowOptions((s) => !s)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          aria-expanded={showOptions}
        >
          <ChevronDown className={`size-4 transition ${showOptions ? 'rotate-180' : ''}`} />
          Custom alias & expiry
        </button>

        {showOptions && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="customAlias" className="label">
                Custom alias <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="customAlias"
                placeholder="my-link"
                className={`input ${errors.customAlias ? 'input-error' : ''}`}
                value={form.customAlias}
                onChange={(e) => update('customAlias', e.target.value)}
              />
              {errors.customAlias ? (
                <p className="mt-1 text-xs text-red-600">{errors.customAlias}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">3–20 letters, numbers, - or _</p>
              )}
            </div>
            <div>
              <label htmlFor="expiresAt" className="label">
                Expires at <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="expiresAt"
                type="datetime-local"
                className={`input ${errors.expiresAt ? 'input-error' : ''}`}
                value={form.expiresAt}
                onChange={(e) => update('expiresAt', e.target.value)}
              />
              {errors.expiresAt && <p className="mt-1 text-xs text-red-600">{errors.expiresAt}</p>}
            </div>
          </div>
        )}
      </form>

      {created && (
        <div className="mt-5 flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-emerald-700 uppercase">Your short link</p>
            <a
              href={created.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate font-medium text-slate-900 hover:text-indigo-700"
            >
              {created.shortUrl}
            </a>
            <p className="truncate text-xs text-slate-500">→ {created.originalUrl}</p>
          </div>
          <CopyButton text={created.shortUrl} label="Copy" className="btn-secondary shrink-0" />
        </div>
      )}
    </div>
  )
}
