import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Cinebook-Frontend/',
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://34.58.239.191:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
