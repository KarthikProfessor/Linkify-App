import { Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2 font-semibold text-slate-900">
      <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
        <Link2 className="size-4.5" />
      </span>
      <span className="text-lg tracking-tight">Linkify</span>
    </Link>
  )
}
