# 聊天应用架构设计

## 系统概述

基于 Pollinations.ai API 的简洁聊天应用，使用现代前端技术栈构建。

## 技术栈

- **包管理器**: Bun
- **前端框架**: React 18
- **样式框架**: Tailwind CSS
- **状态管理**: React Context API
- **测试框架**: Vitest + React Testing Library
- **API**: Pollinations.ai
- **版本控制**: Git

## 项目结构

```
ai_playground/
├── .cursor/                 # 配置和文档目录
│   ├── Dockerfile          # 后台代理环境配置
│   ├── prompts.md         # 项目需求文档
│   ├── architecture.md    # 架构设计文档（本文件）
│   ├── implementation.md  # 实现细节文档
│   └── Dockerfile          # 后台代理环境配置
├── src/                    # 源代码目录
│   ├── components/        # React 组件
│   │   ├── Chat/         # 聊天相关组件
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── Message.tsx
│   │   └── UI/           # 通用 UI 组件
│   ├── services/         # API 服务层
│   │   └── pollinations.ts
│   ├── contexts/         # React Context
│   │   └── ChatContext.tsx
│   ├── types/           # TypeScript 类型定义
│   │   └── chat.ts
│   ├── hooks/           # 自定义 Hooks
│   │   └── useChat.ts
│   ├── utils/           # 工具函数
│   │   └── helpers.ts
│   └── App.tsx          # 应用根组件
├── tests/               # 测试文件
│   ├── components/      # 组件测试
│   ├── services/        # 服务测试
│   └── integration/     # 集成测试
├── public/              # 静态资源
├── package.json         # 项目配置
├── tailwind.config.js   # Tailwind 配置
├── vite.config.ts       # Vite 配置
└── README.md           # 项目说明文档
```

## 核心组件设计

### 1. 用户界面层 (UI Layer)

- **ChatContainer**: 主聊天容器，负责整体布局
- **MessageList**: 消息列表组件，展示历史对话
- **MessageInput**: 消息输入组件，处理用户输入
- **Message**: 单条消息组件，支持用户和 AI 消息样式

### 2. 状态管理层 (State Management)

- **ChatContext**: 使用 React Context API 管理全局聊天状态
- **useChat Hook**: 自定义 Hook 封装聊天逻辑

### 3. 服务层 (Service Layer)

- **PollinationsAPI**: 封装 Pollinations.ai API 调用
- **错误处理**: 统一的 API 错误处理机制
- **请求重试**: 网络请求失败重试机制

### 4. 数据流设计

```
用户输入 → MessageInput → ChatContext → PollinationsAPI → 状态更新 → UI 重渲染
```

## 特性设计

### 1. 实时对话

- 用户发送消息后立即显示
- AI 响应时显示加载状态
- 消息发送失败重试机制

### 2. 响应式设计

- 移动端适配
- 多设备屏幕尺寸支持
- 触摸友好的交互设计

### 3. 用户体验优化

- 消息自动滚动到底部
- 输入框自动聚焦
- 快捷键支持 (Enter 发送)
- 消息时间戳显示

### 4. 错误处理

- 网络错误提示
- API 限制提示
- 用户友好的错误信息

## API 集成

### Pollinations.ai API

- **端点**: https://text.pollinations.ai/
- **方法**: POST
- **参数**:
  - messages: 对话历史
  - model: 使用的模型
  - stream: 是否流式返回

### 请求格式示例

```json
{
  "messages": [{ "role": "user", "content": "Hello!" }],
  "model": "openai",
  "stream": false
}
```

## 测试策略

### 1. 单元测试

- 组件渲染测试
- 用户交互测试
- API 服务测试

### 2. 集成测试

- 端到端聊天流程测试
- API 集成测试

### 3. 性能测试

- 大量消息渲染性能
- 内存使用监控

## 部署考虑

### 1. 构建优化

- 代码分割
- 资源压缩
- Tree Shaking

### 2. 生产环境

- 环境变量配置
- 错误监控
- 性能监控
