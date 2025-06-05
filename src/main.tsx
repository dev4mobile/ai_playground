// React 应用的入口文件 - 负责初始化和渲染 React 应用
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // 导入全局样式文件

// 获取 HTML 中的根节点元素
const rootElement = document.getElementById('root')

// 如果找不到根节点，抛出错误
if (!rootElement) {
  throw new Error('根节点 #root 未找到，请检查 HTML 文件')
}

// 创建 React 根节点并渲染应用
ReactDOM.createRoot(rootElement).render(
  // React.StrictMode 包装器 - 启用严格模式，帮助发现潜在问题
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 