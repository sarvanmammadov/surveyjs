import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'survey-core': ['survey-core'],
          'survey-react-ui': ['survey-react-ui']
        }
      }
    }
  }
})