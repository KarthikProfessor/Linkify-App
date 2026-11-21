import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Clock, Link2, MousePointerClick, PenLine, Smartphone } from 'lucide-react'
import Logo from '../components/Logo'

const features = [
  { icon: PenLine, title: 'Custom aliases', text: 'Turn long URLs into short, memorable links with your own alias.' },
  { icon: Clock, title: 'Expiry & control', text: 'Set expiry dates, pause links or change their destination at any time.' },
  { icon: BarChart3, title: 'Click analytics', text: 'Daily click history plus browser, device, country and referrer breakdowns.' }
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost">
            Log in
          </Link>
          <Link to="/register" className="btn-primary">
            Sign up
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl">
          <div className="aspect-[2/1] w-[60rem] bg-gradient-to-tr from-indigo-200 to-violet-200 opacity-60" />
        </div>
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700">
            <MousePointerClick className="size-3.5" /> Every click, tracked
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            Shorten links. <span className="text-indigo-600">Understand your audience.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Linkify turns long, messy URLs into clean short links — and shows you exactly how they perform.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">
              Get started free <ArrowRight className="size-4" />
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3 text-base">
              I have an account
            </Link>
          </div>

          <div className="card mx-auto mt-14 max-w-xl p-4 text-left">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
              <Link2 className="size-4 shrink-0" />
              <span className="truncate">https://www.example.com/blog/2026/11/how-to-write-great-docs?utm_source=newsletter</span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2.5 text-sm">
              <span className="font-medium text-indigo-700">linkify.app/great-docs</span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Smartphone className="size-3.5" /> 1,284 clicks
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} Linkify</footer>
    </div>
  )
}
