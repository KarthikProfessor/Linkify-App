import { getUrlStatus } from '../utils/format'

const STYLES = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  expired: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  unknown: 'bg-slate-100 text-slate-600 ring-slate-500/20'
}

export default function StatusBadge({ url }) {
  const status = getUrlStatus(url)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
