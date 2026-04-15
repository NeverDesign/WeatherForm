import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  base: '/weatherform/',
  server: {
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Auto-injects token variables into every .scss file in the project.
        // This makes $primary, $space-md, $font-standard etc. available everywhere
        // without explicit imports. _settings.scss has zero CSS output so it is
        // safe to prepend to every file.
        additionalData: `@import "@/assets/styles/settings";`,
        // Bootstrap 5 uses legacy @import internally — suppress those warnings
        // until Bootstrap migrates to @use (expected in Bootstrap 6)
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
