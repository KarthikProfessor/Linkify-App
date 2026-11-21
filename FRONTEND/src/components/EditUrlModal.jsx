import { useEffect, useState } from 'react'
import Modal from './Modal'
import Spinner from './Spinner'
import { urlApi } from '../api/endpoints'
import { getErrorMessage, getFieldErrors } from '../api/client'
import { useToast } from '../context/ToastContext'
import { toDateTimeLocal } from '../utils/format'
import { validateAlias, validateExpiry, validateOriginalUrl } from './urlValidation'

export default function EditUrlModal({ url, open, onClose, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && url) {
      setForm({
        originalUrl: url.originalUrl,
        customAlias: url.shortCode,
        expiresAt: toDateTimeLocal(url.expiresAt),
        isActive: url.isActive !== false
      })
      setErrors({})
    }
  }, [open, url])

  if (!form) return null

  const initialExpiry = toDateTimeLocal(url?.expiresAt)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Only send what changed – the API validates every field it receives
    const payload = {}
    if (form.originalUrl.trim() !== url.originalUrl) payload.originalUrl = form.originalUrl.trim()
    if (form.customAlias.trim() !== url.shortCode) payload.customAlias = form.customAlias.trim()
    if (form.expiresAt !== initialExpiry) {
      payload.expiresAt = form.expiresAt ? new Date(form.expiresAt).toISOString() : null
    }
    if (form.isActive !== (url.isActive !== false)) payload.isActive = form.isActive

    const nextErrors = {
      originalUrl: 'originalUrl' in payload ? validateOriginalUrl(form.originalUrl) : null,
      customAlias:
        'customAlias' in payload
          ? form.customAlias.trim()
            ? validateAlias(form.customAlias)
            : 'Alias cannot be empty'
          : null,
      expiresAt: payload.expiresAt ? validateExpiry(form.expiresAt) : null
    }
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors)
      return
    }

    if (!Object.keys(payload).length) {
      onClose()
      return
    }

    setSaving(true)
    try {
      const saved = await urlApi.update(url._id, payload)
      toast.success('Link updated')
      onSaved?.(saved)
      onClose()
    } catch (err) {
      const fieldErrors = getFieldErrors(err)
      if (err.response?.status === 409) fieldErrors.customAlias = getErrorMessage(err)
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={saving ? undefined : onClose} title="Edit link">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="edit-originalUrl" className="label">
            Destination URL
          </label>
          <input
            id="edit-originalUrl"
            type="url"
            className={`input ${errors.originalUrl ? 'input-error' : ''}`}
            value={form.originalUrl}
            onChange={(e) => update('originalUrl', e.target.value)}
          />
          {errors.originalUrl && <p className="mt-1 text-xs text-red-600">{errors.originalUrl}</p>}
        </div>

        <div>
          <label htmlFor="edit-alias" className="label">
            Short code
          </label>
          <input
            id="edit-alias"
            className={`input ${errors.customAlias ? 'input-error' : ''}`}
            value={form.customAlias}
            onChange={(e) => update('customAlias', e.target.value)}
          />
          {errors.customAlias ? (
            <p className="mt-1 text-xs text-red-600">{errors.customAlias}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Changing this breaks the old short link.</p>
          )}
        </div>

        <div>
          <label htmlFor="edit-expiresAt" className="label">
            Expires at
          </label>
          <div className="flex gap-2">
            <input
              id="edit-expiresAt"
              type="datetime-local"
              className={`input ${errors.expiresAt ? 'input-error' : ''}`}
              value={form.expiresAt}
              onChange={(e) => update('expiresAt', e.target.value)}
            />
            {form.expiresAt && (
              <button type="button" className="btn-secondary shrink-0" onClick={() => update('expiresAt', '')}>
                Clear
              </button>
            )}
          </div>
          {errors.expiresAt ? (
            <p className="mt-1 text-xs text-red-600">{errors.expiresAt}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Leave empty for a link that never expires.</p>
          )}
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-slate-900">Active</span>
            <span className="block text-xs text-slate-500">Inactive links stop redirecting.</span>
          </span>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={form.isActive}
            onChange={(e) => update('isActive', e.target.checked)}
          />
          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/40 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Spinner className="size-4" />}
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  )
}
