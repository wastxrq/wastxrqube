import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * cubing/scramble instantiates its search worker via
 * `import.meta.resolve('./search-worker-entry.js')` — the only bundler-
 * agnostic strategy cubing.js officially supports indefinitely (its other two
 * strategies are compat fallbacks; the "esbuild workaround" one triggers a
 * separate Vite bug — https://github.com/vitejs/vite/issues/3311, "document
 * is not defined" from Vite's dynamic-import preload step running inside a
 * worker). Rollup already bundles this chunk correctly (fully resolved, with
 * cubing's own bare-specifier imports like `random-uint-below` inlined) as a
 * dynamic-import target for that fallback, but only under a hashed filename
 * — it doesn't recognize the string literal inside `import.meta.resolve()`
 * as a worker-entry request, so the literal, unhashed path cubing.js's
 * primary strategy asks for is never emitted. This plugin finds whatever
 * hashed chunk Rollup produced for it and emits a one-line unhashed re-export
 * shim alongside it, so the officially-supported path resolves and the buggy
 * fallback is never reached. Confirmed missing on the actual deployed build
 * (not caught by `vite preview`, which never exercises `new Worker()`/module
 * MIME-type checks the way a real static host does).
 */
function cubingSearchWorkerEntryShim(): Plugin {
  const CHUNK_NAME = 'search-worker-entry'
  return {
    name: 'cubing-search-worker-entry-shim',
    generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find(
        (output) => output.type === 'chunk' && output.name === CHUNK_NAME,
      )
      if (!entry || entry.type !== 'chunk') {
        throw new Error(
          `cubing/scramble's "${CHUNK_NAME}" chunk was not found in the build output — ` +
            'cubing.js may have changed its worker bundling; update cubingSearchWorkerEntryShim in vite.config.ts.',
        )
      }
      const fileName = entry.fileName.split('/').pop()
      this.emitFile({
        type: 'asset',
        fileName: `assets/${CHUNK_NAME}.js`,
        source: `export * from './${fileName}'\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    cubingSearchWorkerEntryShim(),
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
  build: {
    // Vite's dynamic-import preload wrapper touches `document` to inject
    // <link rel="modulepreload">, and unconditionally applies to every
    // dynamic import in the build — it can't detect that inside-VUJSPBRA.js
    // (part of cubing/scramble's search worker) ends up executing inside a
    // Worker, since cubing.js reaches it via a plain dynamic import rather
    // than Vite's own recognized `new Worker(new URL(...))` pattern, so
    // Vite's worker-context skip (`!config.isWorker`) never kicks in for it.
    // `document` is only touched when the computed preload-deps list is
    // non-empty (see Vite's preload() runtime helper); disabling
    // modulePreload filters that list to CSS-only, which is empty for these
    // all-JS worker chunks, sidestepping the crash — see
    // https://github.com/vitejs/vite/issues/3311 (open since 2021, no
    // built-in way to scope this per-chunk). Trade-off: our own route
    // chunks (TimerView/OllTrainerView/...) lose their modulepreload hints
    // too, a minor prefetch-timing cost, not a correctness issue.
    modulePreload: false,
  },
})
