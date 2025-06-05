# AI 聊天助手 - Pollinations Chat

基于 Pollinations.ai API 的现代化聊天应用，使用 React + TypeScript + Tailwind CSS 构建。

## ✨ 特性

- 🤖 **智能对话**: 基于 Pollinations.ai 的多模型 AI 支持
- 💬 **实时聊天**: 流畅的对话体验，支持消息状态显示
- 🎨 **现代 UI**: 使用 Tailwind CSS 构建的美观界面
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 💾 **本地存储**: 自动保存聊天历史
- 🔄 **错误重试**: 智能的消息重发机制
- 📤 **导出功能**: 支持导出聊天记录
- ⚡ **高性能**: 使用 Vite 构建，启动快速
- 🧪 **完整测试**: 包含单元测试和集成测试

## 🚀 快速开始

### 环境要求

- [Bun](https://bun.sh/) >= 1.0.0
- Node.js >= 18.0.0 (可选，推荐使用 Bun)

### 安装依赖

```bash
# 使用 Bun（推荐）
bun install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 使用 Bun
bun run dev

# 或使用 npm
npm run dev
```

应用将在 http://localhost:3000 启动。

### 构建生产版本

```bash
# 使用 Bun
bun run build

# 或使用 npm
npm run build
```

### 运行测试

```bash
# 运行所有测试
bun run test

# 运行测试并生成覆盖率报告
bun run test:coverage

# 启动测试 UI
bun run test:ui
```

## 📁 项目结构

```
ai_playground/
├── .cursor/                 # 配置和文档
│   ├── Dockerfile          # 后台代理环境配置
│   ├── architecture.md     # 架构设计文档
│   └── prompts.md          # 项目需求文档
├── src/                    # 源代码
│   ├── components/         # React 组件
│   │   └── Chat/          # 聊天相关组件
│   ├── contexts/          # React Context
│   ├── hooks/             # 自定义 Hooks
│   ├── services/          # API 服务
│   ├── types/             # TypeScript 类型
│   ├── utils/             # 工具函数
│   └── test/              # 测试配置
├── tests/                 # 测试文件
├── public/                # 静态资源
└── dist/                  # 构建输出
```

## 🛠️ 技术栈

- **前端框架**: React 18
- **类型系统**: TypeScript
- **样式框架**: Tailwind CSS
- **构建工具**: Vite
- **包管理器**: Bun
- **状态管理**: React Context API
- **测试框架**: Vitest + React Testing Library
- **API**: Pollinations.ai

## 🔧 配置说明

### API 配置

应用使用 Pollinations.ai 的免费 API，无需 API 密钥。支持的模型包括：

- OpenAI GPT
- Anthropic Claude
- Mistral AI
- Meta LLaMA
- 阿里通义千问
- DeepSeek

### 环境变量

项目不需要额外的环境变量配置，开箱即用。

### 自定义配置

可以在以下文件中进行自定义配置：

- `tailwind.config.js` - Tailwind CSS 配置
- `vite.config.ts` - Vite 构建配置
- `src/services/pollinations.ts` - API 配置

## 📖 使用指南

### 基本使用

1. 在输入框中输入您的问题或消息
2. 按 Enter 键发送消息（Shift+Enter 换行）
3. AI 将自动回复您的消息
4. 支持连续对话，AI 会记住上下文

### 快捷键

- `Enter` - 发送消息
- `Shift + Enter` - 换行
- `Esc` - 清空输入框

### 功能特性

- **消息操作**: 点击消息可复制内容、查看时间戳
- **重试机制**: 发送失败的消息可以重试
- **聊天记录**: 自动保存到本地存储
- **导出功能**: 可导出聊天记录为文本文件
- **清空记录**: 可清空所有聊天历史

## 🧪 测试

项目包含完整的测试套件：

### 单元测试

```bash
# 运行单元测试
bun run test src/components
bun run test src/services
bun run test src/utils
```

### 集成测试

```bash
# 运行集成测试
bun run test tests/integration
```

### 测试覆盖率

```bash
# 生成测试覆盖率报告
bun run test:coverage
```

## 🚀 部署

### 静态部署

构建后的文件可以部署到任何静态文件服务器：

```bash
# 构建
bun run build

# 预览构建结果
bun run preview
```

### 推荐部署平台

- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 规则
- 编写测试用例
- 使用语义化的提交信息

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Pollinations.ai](https://pollinations.ai/) - 提供免费的 AI API 服务
- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Bun](https://bun.sh/) - JavaScript 运行时和包管理器

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [Issues](https://github.com/your-username/ai_playground/issues)
2. 创建新的 Issue
3. 联系维护者

---

**享受与 AI 的对话吧！** 🤖✨
