import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const STYLES = {
  success: { icon: CheckCircle2, cls: 'text-emerald-600' },
  error: { icon: AlertCircle, cls: 'text-red-600' },
  info: { icon: Info, cls: 'text-indigo-600' }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = ++idRef.current
      setToasts((list) => [...list.slice(-3), { id, type, message }])
      setTimeout(() => dismiss(id), type === 'error' ? 5000 : 3000)
    },
    [dismiss]
  )

  const toast = useMemo(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m)
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((t) => {
          const { icon: Icon, cls } = STYLES[t.type]
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg"
            >
              <Icon className={`mt-0.5 size-4 shrink-0 ${cls}`} />
              <p className="flex-1 text-slate-700">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
