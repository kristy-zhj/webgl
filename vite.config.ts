import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@api': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@img': resolve(__dirname, './src/assets/images'),
      '@sass': resolve(__dirname, './src/assets/sass'),
      '@routes': resolve(__dirname, './src/routes'),
      '@locales': resolve(__dirname, './src/locales'),
    },
  },
  plugins: [react()],
  server: {
    port: 3301,
    open: false,
  },
})
