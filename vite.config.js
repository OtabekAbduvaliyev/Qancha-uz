import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => ({
  plugins: [react()],
  base: '/',
  build: {
    outDir: ssrBuild ? 'dist/server' : 'dist/client',
    assetsDir: 'assets',
    rollupOptions: !ssrBuild ? {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    } : undefined
  },
  ssr: {
    // SSR-specific config
    format: 'esm',
    target: 'node',
    noExternal: ['react-helmet-async']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async']
  },
  server: {
    middlewareMode: true
  }
}))
