import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  define: {
    'global': 'window',
    'process.env': {}
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  
  // Server configuration
  server: {
    port: 5173,  
    open: true,  // Auto-open browser
    strictPort: true,  // Fail if port is already in use
  },
  
  // Build configuration
  build: {
    sourcemap: true,
  },
})