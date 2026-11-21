import { Link } from 'react-router-dom'
import { BarChart3, Calendar, MousePointerClick, Pencil, Power, Trash2 } from 'lucide-react'
import CopyButton from './CopyButton'
import StatusBadge from './StatusBadge'
import { formatDate, formatNumber, stripProtocol } from '../utils/format'

export default function LinkRow({ url, onEdit, onDelete, onToggleActive, toggling }) {
  return (
    <li className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate font-medium text-indigo-700 hover:underline"
          >
            {stripProtocol(url.shortUrl)}
          </a>
          <StatusBadge url={url} />
        </div>
        <p className="mt-0.5 truncate text-sm text-slate-500" title={url.originalUrl}>
          {url.originalUrl}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MousePointerClick className="size-3.5" />
            {formatNumber(url.clicks)} clicks
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            Created {formatDate(url.createdAt)}
          </span>
          {url.expiresAt && <span>Expires {formatDate(url.expiresAt, true)}</span>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <CopyButton text={url.shortUrl} />
        <Link to={`/links/${url._id}`} className="btn-secondary px-2.5 py-1.5" title="Analytics">
          <BarChart3 className="size-4" />
          <span className="sr-only">Analytics</span>
        </Link>
        <button className="btn-secondary px-2.5 py-1.5" onClick={() => onEdit(url)} title="Edit">
          <Pencil className="size-4" />
          <span className="sr-only">Edit</span>
        </button>
        <button
          className={`btn-secondary px-2.5 py-1.5 ${url.isActive === false ? 'text-slate-400' : 'text-emerald-600'}`}
          onClick={() => onToggleActive(url)}
          disabled={toggling}
          title={url.isActive === false ? 'Activate' : 'Deactivate'}
        >
          <Power className="size-4" />
          <span className="sr-only">{url.isActive === false ? 'Activate' : 'Deactivate'}</span>
        </button>
        <button
          className="btn-secondary px-2.5 py-1.5 text-red-600 hover:bg-red-50"
          onClick={() => onDelete(url)}
          title="Delete"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </button>
      </div>
    </li>
  )
}
