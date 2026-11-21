import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { PageLoader } from './Spinner'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
