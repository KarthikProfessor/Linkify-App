import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Link2, MousePointerClick, Trophy } from 'lucide-react'
import { analyticsApi } from '../api/endpoints'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import CreateUrlForm from '../components/CreateUrlForm'
import StatCard from '../components/StatCard'
import ClicksChart from '../components/ClicksChart'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { PageLoader } from '../components/Spinner'
import { fillDailySeries, formatNumber, stripProtocol } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [topLinks, setTopLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const [dashboard, top] = await Promise.all([analyticsApi.dashboard(), analyticsApi.topLinks(5)])
      setStats(dashboard)
      setTopLinks(Array.isArray(top) ? top : [])
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your dashboard.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const firstName = user?.name?.split(' ')[0]
  const series = fillDailySeries(stats?.clicksByDate, 30)
  const last30 = series.reduce((sum, d) => sum + d.clicks, 0)
  const maxTop = Math.max(1, ...topLinks.map((l) => l.clicks || 0))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Hi {firstName} 👋</h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s how your links are performing.</p>
      </div>

      <CreateUrlForm onCreated={load} />

      {loading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total links" value={formatNumber(stats.totalUrls)} icon={Link2} />
            <StatCard
              label="Total clicks"
              value={formatNumber(stats.totalClicks)}
              icon={MousePointerClick}
              accent="sky"
              hint={`${formatNumber(last30)} in the last 30 days`}
            />
            <StatCard label="Active links" value={formatNumber(stats.activeUrls)} icon={CheckCircle2} accent="emerald" />
            <StatCard label="Expired links" value={formatNumber(stats.expiredUrls)} icon={Clock} accent="amber" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-2">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-base font-semibold text-slate-900">Clicks</h2>
                <span className="text-xs text-slate-500">Last 30 days (UTC)</span>
              </div>
              <ClicksChart data={series} />
            </div>

            <div className="card flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Trophy className="size-4 text-amber-500" /> Top links
                </h2>
                <Link to="/links" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  View all
                </Link>
              </div>
              {topLinks.length === 0 ? (
                <EmptyState icon={Link2} title="No links yet" description="Shorten your first link above." />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {topLinks.map((l, i) => (
                    <li key={l._id}>
                      <Link to={`/links/${l._id}`} className="group flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                        <span className="w-4 text-sm font-medium text-slate-400">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900 group-hover:text-indigo-700">
                            {stripProtocol(l.shortUrl)}
                          </p>
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${Math.max(((l.clicks || 0) / maxTop) * 100, 2)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 tabular-nums">{formatNumber(l.clicks)}</span>
                        <ArrowRight className="size-4 text-slate-300 group-hover:text-indigo-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
