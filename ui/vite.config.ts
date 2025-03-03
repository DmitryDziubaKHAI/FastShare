// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const API_URL = 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { 
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@presentation': path.resolve(__dirname, './src/presentation')
    }
  },
  server: {
    proxy: {
      '/signup': {
        target: API_URL,
        changeOrigin: true,
      },
      '/login': {
        target: API_URL,
        changeOrigin: true,
      },
      '/upload': {
        target: API_URL,
        changeOrigin: true,
      },
      '/files': {
        target: API_URL,
        changeOrigin: true,
      },
      '/download': {
        target: API_URL,
        changeOrigin: true,
      },
      '/clear-files': {
        target: API_URL,
        changeOrigin: true,
      }
    },
  },
});
