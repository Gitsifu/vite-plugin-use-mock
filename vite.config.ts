import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginUseMock from './vite/index.ts'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
    // 省略扩展名
    server: {
        port: 8080,
        proxy: {
            '/mock-api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/mock-api/, '')
            }
        }
    },
    // 别名
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    plugins: [
        vue(),
        VitePluginUseMock({
            modulesDir: path.resolve(__dirname, './src/mock/modules'),
            outputPath: path.resolve(__dirname, './src/mock/db.json5')
        })
    ],
})
