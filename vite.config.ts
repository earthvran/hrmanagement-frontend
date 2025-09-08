import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // local เท่านั้น
  },
  build: {
    outDir: 'dist',
  },
})