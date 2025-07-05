import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/claude-breakout-clone/' : '/',
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    target: 'es2020'
  }
})