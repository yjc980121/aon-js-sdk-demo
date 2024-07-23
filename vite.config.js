import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 这里可以指定 IP 地址，比如 '192.168.1.100'
    port: 5174, // 你希望使用的端口
  },
})
