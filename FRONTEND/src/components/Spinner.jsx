export default function Spinner({ className = 'size-5' }) {
  return (
    <svg className={`animate-spin text-current ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-indigo-600">
      <Spinner className="size-8" />
    </div>
  )
}
