import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
  build: {
    rollupOptions: {
      external: [
        '@tauri-apps/plugin-updater',
        '@tauri-apps/plugin-process'
      ]
    }
  },
  clearScreen: false,
  envPrefix: ["VITE_", "TAURI_"]
})
