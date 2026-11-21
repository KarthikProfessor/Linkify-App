import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../utils/format'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-slate-900">{p.label}</p>
      <p className="text-slate-600">
        {formatNumber(p.clicks)} click{p.clicks === 1 ? '' : 's'}
      </p>
    </div>
  )
}

export default function ClicksChart({ data, height = 260 }) {
  const total = data.reduce((sum, d) => sum + d.clicks, 0)

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#eef2ff' }} />
          <Bar dataKey="clicks" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      {total === 0 && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="rounded-md bg-white/80 px-3 py-1 text-sm text-slate-500">No clicks in this period yet</p>
        </div>
      )}
    </div>
  )
}
