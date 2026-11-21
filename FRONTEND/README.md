# Linkify – Frontend

React + Tailwind CSS client for the Linkify URL shortener API.

## Stack
- React 19 + React Router 7 (Vite)
- Tailwind CSS 4
- Axios (JWT attached automatically, auto-logout on 401)
- Recharts (click history), lucide-react (icons)

## Getting started

```bash
npm install
cp .env.example .env     # set VITE_API_URL if your API isn't on localhost:3000
npm run dev              # http://localhost:5173
```

The backend must allow this origin: set `CLIENT_URL=http://localhost:5173` in the backend `.env`
(the dev server is pinned to port 5173 so CORS keeps working).

## Pages
| Route | What it does |
|---|---|
| `/` | Landing page (redirects to dashboard when logged in) |
| `/register`, `/login` | Auth – token stored in `localStorage` |
| `/dashboard` | Totals, 30-day click chart, top links, quick shorten |
| `/links` | Paginated list: copy, edit, activate/deactivate, delete |
| `/links/:id` | Per-link analytics: summary, history (7d/30d/90d/1y), browser/device/referrer/country breakdown |

## Project structure
```
src/
  api/          axios client, error helpers, endpoint functions
  context/      AuthContext (session), ToastContext (notifications)
  components/   UI building blocks (forms, modal, charts, rows...)
  pages/        route components
  utils/        date/number formatting, chart gap-filling
```

## Deploying
`npm run build` outputs static files to `dist/`. On Netlify/Vercel/Render static sites, add an SPA
rewrite (all paths → `/index.html`) and set `VITE_API_URL` to your deployed API URL **at build time**.
Remember to update the backend's `CLIENT_URL` to the deployed frontend origin.
