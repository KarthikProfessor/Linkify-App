import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { GuestRoute, ProtectedRoute } from './components/RouteGuards'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { PageLoader } from './components/Spinner'

// Logged-in pages pull in the charting library, so load them on demand
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Links = lazy(() => import('./pages/Links'))
const LinkDetails = lazy(() => import('./pages/LinkDetails'))

function Home() {
  const { isAuthenticated, initializing } = useAuth()
  if (initializing) return <PageLoader />
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/links" element={<Links />} />
          <Route path="/links/:id" element={<LinkDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  )
}
