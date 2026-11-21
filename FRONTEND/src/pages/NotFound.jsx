import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold text-indigo-600">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="btn-primary mt-6">
          Go {isAuthenticated ? 'to dashboard' : 'home'}
        </Link>
      </div>
    </div>
  )
}
