import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/shop-proxy': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shop-proxy/, ''),
      },
      '/auth-proxy': {
        target: 'http://localhost:8091',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth-proxy/, ''),
      },
      '/core-proxy': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/core-proxy/, ''),
      },
    },
  },
})
