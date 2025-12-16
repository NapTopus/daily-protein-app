/// <reference types="vitest" />

import UnoCSS from 'unocss/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    legacy(),
    Components({
      resolvers: [
        (name) => {
          if (name.startsWith('Ion')) {
            return {
              name,            // 元件名稱
              from: '@ionic/vue' // 指定匯入來源
            }
          }
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://daily-protein.lynkishere.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost'
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
