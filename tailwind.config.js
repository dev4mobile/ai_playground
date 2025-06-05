/** @type {import('tailwindcss').Config} */
export default {
  // 指定需要扫描的文件路径，用于 Tailwind 的 CSS 类名检测和优化
  content: [
    "./index.html", // HTML 入口文件
    "./src/**/*.{js,ts,jsx,tsx}", // src 目录下所有的 JavaScript/TypeScript 文件
  ],
  
  // 主题配置
  theme: {
    extend: {
      // 扩展默认配色
      colors: {
        // 聊天应用的主题色彩
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        // 消息气泡颜色
        user: {
          bg: '#3b82f6',
          text: '#ffffff'
        },
        ai: {
          bg: '#f3f4f6',
          text: '#1f2937'
        }
      },
      
      // 扩展动画
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out', // 消息淡入动画
        'slide-up': 'slideUp 0.2s ease-out', // 消息滑入动画
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' // 加载动画
      },
      
      // 自定义关键帧动画
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        }
      }
    }
  },
  
  // 插件配置
  plugins: [
    // 可以在这里添加 Tailwind 插件，如 @tailwindcss/forms
  ]
} 