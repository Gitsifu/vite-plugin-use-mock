import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginUseMock from './vite/index.ts'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      VitePluginUseMock({
          modulesDir: path.resolve(__dirname, './src/mock/modules'),
          outputPath: path.resolve(__dirname, './src/mock/db.json5')
      })
  ],
})
