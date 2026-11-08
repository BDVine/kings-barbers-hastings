import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two designs side by side: "/" = Design A, "/b/" = Design B
      input: {
        main: resolve(__dirname, 'index.html'),
        b: resolve(__dirname, 'b/index.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
