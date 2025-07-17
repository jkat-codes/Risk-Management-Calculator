import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', 
  clearScreen: false, 
  server: {
    port: 5173, 
    strictPort: true, 
    watch: {
      usePolling: true
    }, 
  },
  build: {
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG, 
  },
  envPrefix: ["VITE_", "TAURI_"]
})
