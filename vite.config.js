import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ssr()],
  ssr: {
    noExternal: ['react-helmet-async']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'pages': path.resolve(__dirname, './pages'),
      'renderer': path.resolve(__dirname, './renderer')
    }
  }
});
