import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage, getFieldErrors } from '../api/client'

function validate(form) {
  const name = form.name.trim()
  return {
    name: name.length < 2 || name.length > 50 ? 'Name must be between 2 and 50 characters' : null,
    email: /^\S+@\S+\.\S+$/.test(form.email.trim()) ? null : 'Please provide a valid email',
    password:
      form.password.length < 8
        ? 'Password must contain at least 8 characters'
        : form.password.length > 72
          ? 'Password must be at most 72 characters'
          : null,
    confirm: form.confirm !== form.password ? 'Passwords do not match' : null
  }
}

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
    setFormError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const next = validate(form)
    if (Object.values(next).some(Boolean)) return setErrors(next)

    setLoading(true)
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      })
      toast.success(`Welcome, ${user.name}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const fieldErrors = getFieldErrors(err)
      if (err.response?.status === 409) fieldErrors.email = getErrorMessage(err)
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) setFormError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { id: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
    { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', hint: 'At least 8 characters' },
    { id: 'confirm', label: 'Confirm password', type: 'password', autoComplete: 'new-password' }
  ]

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start shortening and tracking links in seconds."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {formError}
          </div>
        )}
        {fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={f.id} className="label">
              {f.label}
            </label>
            <input
              id={f.id}
              type={f.type}
              autoComplete={f.autoComplete}
              className={`input ${errors[f.id] ? 'input-error' : ''}`}
              value={form[f.id]}
              onChange={update(f.id)}
            />
            {errors[f.id] ? (
              <p className="mt-1 text-xs text-red-600">{errors[f.id]}</p>
            ) : (
              f.hint && <p className="mt-1 text-xs text-slate-500">{f.hint}</p>
            )}
          </div>
        ))}
        <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
          {loading && <Spinner className="size-4" />}
          Create account
        </button>
      </form>
    </AuthLayout>
  )
}
