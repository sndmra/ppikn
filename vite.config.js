import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    logLevel: 'info',
    rollupOptions: {
      onwarn(warning, warn) {
        console.warn('Rollup Warning:', warning.message);
        warn(warning);
      }
    }
  }
})
