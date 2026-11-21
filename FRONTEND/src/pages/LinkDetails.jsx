import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarClock,
  Compass,
  ExternalLink,
  Globe,
  History,
  MonitorSmartphone,
  MousePointerClick,
  Pencil,
  Share2,
  Trash2
} from 'lucide-react'
import { analyticsApi, urlApi } from '../api/endpoints'
import { getErrorMessage } from '../api/client'
import { useToast } from '../context/ToastContext'
import StatCard from '../components/StatCard'
import ClicksChart from '../components/ClicksChart'
import BreakdownCard from '../components/BreakdownCard'
import CopyButton from '../components/CopyButton'
import StatusBadge from '../components/StatusBadge'
import EditUrlModal from '../components/EditUrlModal'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorState from '../components/ErrorState'
import Spinner, { PageLoader } from '../components/Spinner'
import { fillDailySeries, formatDate, formatNumber, timeAgo } from '../utils/format'

const RANGES = [7, 30, 90, 365]

export default function LinkDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [url, setUrl] = useState(null)
  const [summary, setSummary] = useState(null)
  const [breakdown, setBreakdown] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [days, setDays] = useState(30)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [u, s, b] = await Promise.all([urlApi.get(id), analyticsApi.summary(id), analyticsApi.breakdown(id)])
      setUrl(u)
      setSummary(s)
      setBreakdown(b)
    } catch (err) {
      const status = err.response?.status
      setError({
        notFound: status === 404 || status === 400,
        message: getErrorMessage(err, 'Could not load this link.')
      })
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let cancelled = false
    setHistoryLoading(true)
    analyticsApi
      .history(id, days)
      .then((h) => !cancelled && setHistory(Array.isArray(h) ? h : []))
      .catch(() => !cancelled && setHistory([]))
      .finally(() => !cancelled && setHistoryLoading(false))
    return () => {
      cancelled = true
    }
  }, [id, days])

  async function handleDelete() {
    setDeleting(true)
    try {
      await urlApi.remove(id)
      toast.success('Link deleted')
      navigate('/links', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
      setDeleting(false)
    }
  }

  if (loading) return <PageLoader />

  if (error) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          message={error.notFound ? "This link doesn't exist or you don't have access to it." : error.message}
          onRetry={error.notFound ? undefined : load}
        />
      </div>
    )
  }

  const series = fillDailySeries(history, days)
  const periodClicks = series.reduce((sum, d) => sum + d.clicks, 0)

  return (
    <div className="space-y-6">
      <BackLink />

      {/* Header */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">{url.shortUrl}</h1>
              <StatusBadge url={url} />
            </div>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1 text-sm text-slate-500 hover:text-indigo-700"
            >
              <span className="truncate">{url.originalUrl}</span>
              <ExternalLink className="size-3.5 shrink-0" />
            </a>
            <p className="mt-2 text-xs text-slate-500">
              Created {formatDate(url.createdAt, true)}
              {url.expiresAt && <> · Expires {formatDate(url.expiresAt, true)}</>}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <CopyButton text={url.shortUrl} label="Copy" className="btn-secondary" />
            <button className="btn-secondary" onClick={() => setEditing(true)}>
              <Pencil className="size-4" /> Edit
            </button>
            <button className="btn-secondary text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total clicks" value={formatNumber(summary?.totalClicks ?? url.clicks)} icon={MousePointerClick} />
        <StatCard
          label={`Last ${days} days`}
          value={historyLoading ? '…' : formatNumber(periodClicks)}
          icon={History}
          accent="sky"
        />
        <StatCard
          label="First click"
          value={summary?.firstClick ? formatDate(summary.firstClick) : '—'}
          icon={CalendarClock}
          accent="emerald"
        />
        <StatCard
          label="Last click"
          value={summary?.lastClick ? timeAgo(summary.lastClick) : 'Never'}
          hint={summary?.lastClick ? formatDate(summary.lastClick, true) : undefined}
          icon={CalendarClock}
          accent="amber"
        />
      </div>

      {/* History */}
      <div className="card p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            Click history {historyLoading && <Spinner className="size-4 text-indigo-500" />}
          </h2>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5" role="group">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDays(r)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  days === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-pressed={days === r}
              >
                {r === 365 ? '1y' : `${r}d`}
              </button>
            ))}
          </div>
        </div>
        <ClicksChart data={series} />
      </div>

      {/* Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <BreakdownCard title="Browsers" icon={Compass} items={breakdown?.browserStats} color="bg-indigo-500" />
        <BreakdownCard title="Devices" icon={MonitorSmartphone} items={breakdown?.deviceStats} color="bg-sky-500" />
        <BreakdownCard title="Top referrers" icon={Share2} items={breakdown?.referrerStats} color="bg-violet-500" />
        <BreakdownCard title="Top countries" icon={Globe} items={breakdown?.countryStats} color="bg-emerald-500" />
      </div>

      <EditUrlModal
        url={url}
        open={editing}
        onClose={() => setEditing(false)}
        onSaved={(saved) => setUrl((u) => ({ ...u, ...saved }))}
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete link?"
        message="This short link will stop working immediately and its analytics will be lost. This can't be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/links" className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
      <ArrowLeft className="size-4" /> Back to links
    </Link>
  )
}
