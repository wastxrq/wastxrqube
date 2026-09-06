import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'wastxrqube',
        short_name: 'wastxrqube',
        description:
          'Rubik’s Cube speedsolving trainer — timer, OLL/PLL/F2L reference and practice.',
        theme_color: '#35e0c0',
        background_color: '#14161b',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      includeAssets: ['apple-touch-icon.png'],
      // Default generateSW precaches every built js/css/html/asset file, which
      // already covers cubing/scramble's dynamically-imported WASM solver
      // chunk (it's emitted as a plain .js file, not a separate .wasm asset —
      // verified against the actual dist/ output) — no extra runtimeCaching
      // rule needed for it, or for anything else, since this app makes no
      // external API calls for its core functionality (timer/OLL/PLL/F2L are
      // all local computation + localStorage).
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
