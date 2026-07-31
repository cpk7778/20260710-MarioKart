import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use relative asset paths so the app works on GitHub Pages subpaths and in Tauri file:// builds.
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
