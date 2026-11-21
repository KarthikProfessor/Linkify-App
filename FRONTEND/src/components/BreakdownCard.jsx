import { formatNumber } from '../utils/format'

export default function BreakdownCard({ title, icon: Icon, items = [], color = 'bg-indigo-500' }) {
  const rows = items.map((i) => ({ name: i._id || 'Unknown', clicks: i.clicks }))
  const total = rows.reduce((sum, r) => sum + r.clicks, 0)

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="size-4 text-slate-500" />}
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">No data yet</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const pct = total ? Math.round((r.clicks / total) * 100) : 0
            return (
              <li key={r.name}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-slate-700" title={r.name}>
                    {r.name}
                  </span>
                  <span className="shrink-0 text-slate-500 tabular-nums">
                    {formatNumber(r.clicks)} <span className="text-slate-400">· {pct}%</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
