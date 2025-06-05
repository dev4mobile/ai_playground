import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 配置文件 - 用于构建和开发服务器配置
// https://vitejs.dev/config/
export default defineConfig({
  // 插件配置
  plugins: [
    react() // React 插件，支持 React 组件的热重载和 JSX 编译
  ],
  
  // 开发服务器配置
  server: {
    port: 3000, // 开发服务器端口
    open: true, // 自动打开浏览器
    host: true  // 允许外部访问
  },
  
  // 构建配置
  build: {
    outDir: 'dist', // 输出目录
    sourcemap: true, // 生成 source map 用于调试
    minify: 'esbuild', // 使用 esbuild 进行代码压缩
    target: 'es2020' // 目标 JavaScript 版本
  },
  
  // 测试配置
  test: {
    environment: 'jsdom', // 使用 jsdom 模拟浏览器环境进行测试
    setupFiles: ['./src/test/setup.ts'], // 测试设置文件
    globals: true, // 全局测试函数 (describe, it, expect)
    css: true // 支持 CSS 模块测试
  }
}) 