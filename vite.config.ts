import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Dodanie konfiguracji serwera dev
  server: {
    port: 5173,
    strictPort: false,
    open: true, // automatycznie otwórz przeglądarkę
    cors: true, // włącz CORS
    hmr: {
      // Te opcje mogą pomóc przy problemach z WebSocket
      host: 'localhost',
      protocol: 'ws'
    }
  }
})