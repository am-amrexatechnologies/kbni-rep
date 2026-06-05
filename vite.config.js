import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:3000'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: {
    proxy: {
      '/auth':       { target: API_TARGET, changeOrigin: true },
      '/users':      { target: API_TARGET, changeOrigin: true },
      '/chat':       { target: API_TARGET, changeOrigin: true },
      '/anime':      { target: API_TARGET, changeOrigin: true },
      '/characters': { target: API_TARGET, changeOrigin: true },
      '/ratings':    { target: API_TARGET, changeOrigin: true },
    }
  }
})
