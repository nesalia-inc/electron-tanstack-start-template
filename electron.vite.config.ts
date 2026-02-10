import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use 127.0.0.1 instead of localhost
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  main: {
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/main/index.ts'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/preload/index.ts'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: resolve(__dirname, '.'),
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'index-electron.html'),
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@electron': resolve(__dirname, './electron'),
      },
    },
    plugins: [react()],
  },
  // Configure output directories
  publicDir: 'public',
})
