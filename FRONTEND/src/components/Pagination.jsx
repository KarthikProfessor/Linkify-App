import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, total, onChange, disabled }) {
  if (!totalPages || totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 sm:px-5">
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-700">{page}</span> of{' '}
        <span className="font-medium text-slate-700">{totalPages}</span>
        {total != null && <span className="hidden sm:inline"> · {total} links</span>}
      </p>
      <div className="flex gap-2">
        <button className="btn-secondary px-2.5" onClick={() => onChange(page - 1)} disabled={disabled || page <= 1}>
          <ChevronLeft className="size-4" />
          <span className="sr-only sm:not-sr-only">Previous</span>
        </button>
        <button
          className="btn-secondary px-2.5"
          onClick={() => onChange(page + 1)}
          disabled={disabled || page >= totalPages}
        >
          <span className="sr-only sm:not-sr-only">Next</span>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
