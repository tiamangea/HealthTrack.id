import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/nama-repository-kamu/', // Ganti dengan nama repo yang tepat
  plugins: [react()],
})
