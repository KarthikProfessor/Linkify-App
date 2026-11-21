import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, getFieldErrors } from '../api/client'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
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
    const next = {
      email: /^\S+@\S+\.\S+$/.test(form.email.trim()) ? null : 'Please provide a valid email',
      password: form.password ? null : 'Password is required'
    }
    if (next.email || next.password) return setErrors(next)

    setLoading(true)
    try {
      await login({ email: form.email.trim().toLowerCase(), password: form.password })
      const to = location.state?.from?.pathname || '/dashboard'
      navigate(to, { replace: true })
    } catch (err) {
      const fieldErrors = getFieldErrors(err)
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) setFormError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your links."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign up
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
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            value={form.email}
            onChange={update('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={form.password}
            onChange={update('password')}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>
        <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
          {loading && <Spinner className="size-4" />}
          Log in
        </button>
      </form>
    </AuthLayout>
  )
}
