import { BarChart3, Link2, ShieldCheck } from 'lucide-react'
import Logo from './Logo'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-6">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-indigo-600 lg:flex lg:items-center lg:justify-center">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-indigo-500/60 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-violet-500/50 blur-3xl" />
        <div className="relative max-w-md px-10 text-white">
          <h2 className="text-3xl font-semibold tracking-tight">Short links. Real insights.</h2>
          <p className="mt-3 text-indigo-100">
            Create memorable short links and see exactly who clicks them — by day, browser, device and source.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {[
              [Link2, 'Custom aliases and expiry dates'],
              [BarChart3, 'Click history and audience breakdown'],
              [ShieldCheck, 'Pause or edit links any time']
            ].map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-white/15">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
