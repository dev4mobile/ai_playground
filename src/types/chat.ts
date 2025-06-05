// 聊天相关的 TypeScript 类型定义文件

/**
 * 消息发送者类型
 * - user: 用户消息
 * - ai: AI 助手消息
 */
export type MessageRole = 'user' | 'ai'

/**
 * 消息状态类型
 * - sent: 已发送
 * - sending: 发送中
 * - failed: 发送失败
 * - received: 已接收（AI 消息）
 */
export type MessageStatus = 'sent' | 'sending' | 'failed' | 'received'

/**
 * 单条消息接口
 */
export interface Message {
  id: string           // 消息唯一标识符
  role: MessageRole    // 消息发送者角色
  content: string      // 消息内容
  timestamp: number    // 消息时间戳（Unix 时间戳）
  status: MessageStatus // 消息状态
}

/**
 * 聊天上下文状态接口
 */
export interface ChatState {
  messages: Message[]          // 消息列表
  isLoading: boolean          // 是否正在加载 AI 响应
  error: string | null        // 错误信息
  conversationId: string | null // 对话 ID（可选，用于会话管理）
}

/**
 * 聊天上下文操作接口
 */
export interface ChatActions {
  sendMessage: (content: string) => Promise<void>  // 发送消息
  clearMessages: () => void                        // 清空消息历史
  retryLastMessage: () => Promise<void>            // 重试最后一条消息
  updateMessageStatus: (id: string, status: MessageStatus) => void // 更新消息状态
}

/**
 * Pollinations.ai API 请求接口
 */
export interface PollinationsRequest {
  messages: Array<{
    role: string    // 消息角色
    content: string // 消息内容
  }>
  model?: string    // 使用的模型（可选）
  stream?: boolean  // 是否使用流式响应（可选）
  temperature?: number // 响应的随机性（0-1）
  max_tokens?: number  // 最大令牌数
}

/**
 * Pollinations.ai API 响应接口
 */
export interface PollinationsResponse {
  id?: string        // 响应 ID
  choices?: Array<{
    message: {
      role: string     // 响应角色
      content: string  // 响应内容
    }
    finish_reason?: string // 结束原因
  }>
  error?: {
    message: string    // 错误信息
    type?: string      // 错误类型
    code?: string      // 错误代码
  }
}

/**
 * API 错误类
 */
export class APIError extends Error {
  status?: number      // HTTP 状态码
  code?: string        // 错误代码

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.code = code
  }
}

/**
 * 组件 Props 类型定义
 */

/**
 * 消息组件 Props
 */
export interface MessageProps {
  message: Message              // 消息数据
  onRetry?: () => void         // 重试回调函数（可选）
  className?: string           // 自定义 CSS 类名（可选）
}

/**
 * 消息列表组件 Props
 */
export interface MessageListProps {
  messages: Message[]          // 消息列表
  isLoading?: boolean         // 是否显示加载状态
  onRetry?: (messageId: string) => void // 重试回调函数（可选）
  className?: string          // 自定义 CSS 类名（可选）
}

/**
 * 消息输入组件 Props
 */
export interface MessageInputProps {
  onSendMessage: (content: string) => void // 发送消息回调函数
  disabled?: boolean                       // 是否禁用输入
  placeholder?: string                     // 输入框占位符
  className?: string                       // 自定义 CSS 类名（可选）
}

/**
 * 聊天容器组件 Props
 */
export interface ChatContainerProps {
  className?: string    // 自定义 CSS 类名（可选）
  title?: string        // 聊天标题（可选）
} 