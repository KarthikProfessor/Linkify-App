import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Must match CLIENT_URL in the backend .env (CORS)
    port: 5173,
    strictPort: true
  }
})
