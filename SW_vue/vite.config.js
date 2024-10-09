import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: 'localhost',  // 도메인 고정
    port: 5177,         // 포트 번호 고정
    strictPort: true,   // 포트가 이미 사용 중일 때 에러 발생
    proxy: {
      '/api': {
        target: 'http://www.aladin.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/ttb/api'),
      },
    },

  },
})
