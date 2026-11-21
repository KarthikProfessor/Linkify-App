import { AlertTriangle, RotateCw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="size-6" />
      </span>
      <p className="mt-4 text-sm text-slate-700">{message}</p>
      {onRetry && (
        <button className="btn-secondary mt-4" onClick={onRetry}>
          <RotateCw className="size-4" /> Try again
        </button>
      )}
    </div>
  )
}
