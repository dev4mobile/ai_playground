// Pollinations.ai API 服务层 - 封装所有 API 调用和数据处理逻辑
import type { 
  PollinationsRequest, 
  PollinationsResponse, 
  Message
} from '../types/chat'
import { APIError } from '../types/chat'

/**
 * Pollinations.ai API 基础配置
 */
const API_CONFIG = {
  BASE_URL: 'https://text.pollinations.ai',
  TIMEOUT: 30000, // 30秒超时
  RETRY_ATTEMPTS: 3, // 重试次数
  RETRY_DELAY: 1000 // 重试延迟（毫秒）
} as const

/**
 * 睡眠函数 - 用于重试延迟
 * @param ms - 延迟毫秒数
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * 创建带有超时的 fetch 请求
 * @param url - 请求 URL
 * @param options - fetch 选项
 * @param timeout - 超时时间
 */
const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout: number = API_CONFIG.TIMEOUT
): Promise<Response> => {
  // 创建超时控制器
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    // 发起请求，包含超时控制
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

/**
 * 将消息历史转换为 Pollinations 格式
 * @param messages - 消息列表
 * @returns 转换后的消息格式
 */
const formatMessagesForAPI = (messages: Message[]): Array<{role: string, content: string}> => {
  return messages.map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : 'user', // 转换角色格式
    content: msg.content
  }))
}

/**
 * 构建请求 URL
 * @param prompt - 用户输入提示
 * @param options - 可选参数
 */
const buildRequestURL = (
  prompt: string, 
  options: Partial<PollinationsRequest> = {}
): string => {
  // URL 编码用户输入
  const encodedPrompt = encodeURIComponent(prompt)
  let url = `${API_CONFIG.BASE_URL}/${encodedPrompt}`

  // 添加查询参数
  const params = new URLSearchParams()
  
  if (options.model) {
    params.append('model', options.model)
  }
  
  if (options.temperature !== undefined) {
    params.append('temperature', options.temperature.toString())
  }
  
  if (options.max_tokens !== undefined) {
    params.append('max_tokens', options.max_tokens.toString())
  }

  // 如果有参数，添加到 URL
  const queryString = params.toString()
  if (queryString) {
    url += `?${queryString}`
  }

  return url
}

/**
 * 发送聊天消息到 Pollinations.ai API
 * @param messages - 消息历史
 * @param options - API 选项
 * @returns Promise<string> - AI 响应文本
 */
export const sendChatMessage = async (
  messages: Message[],
  options: Partial<PollinationsRequest> = {}
): Promise<string> => {
  // 获取最新的用户消息作为提示
  const lastUserMessage = messages
    .filter(msg => msg.role === 'user')
    .pop()

  if (!lastUserMessage) {
    throw new APIError('没有找到用户消息')
  }

  // 设置默认选项
  const requestOptions: Partial<PollinationsRequest> = {
    model: 'openai', // 默认使用 OpenAI 模型
    temperature: 0.7, // 适中的创造性
    max_tokens: 1000, // 适中的响应长度
    ...options
  }

  let lastError: Error | null = null

  // 重试逻辑
  for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`尝试发送消息 (第 ${attempt} 次)...`)
      
      // 构建请求 URL
      const url = buildRequestURL(lastUserMessage.content, requestOptions)
      
      // 发送请求
      const response = await fetchWithTimeout(url, {
        method: 'GET', // Pollinations 使用 GET 请求
        headers: {
          'Accept': 'text/plain',
          'User-Agent': 'PollinationsChat/1.0'
        }
      })

      // 检查响应状态
      if (!response.ok) {
        throw new APIError(
          `API 请求失败: ${response.status} ${response.statusText}`,
          response.status
        )
      }

      // 获取响应文本
      const responseText = await response.text()
      
      if (!responseText || responseText.trim().length === 0) {
        throw new APIError('API 返回空响应')
      }

      console.log('消息发送成功')
      return responseText.trim()

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`第 ${attempt} 次尝试失败:`, lastError.message)

      // 如果不是最后一次尝试，等待后重试
      if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
        const delay = API_CONFIG.RETRY_DELAY * attempt // 指数退避
        console.log(`等待 ${delay}ms 后重试...`)
        await sleep(delay)
      }
    }
  }

  // 所有重试都失败，抛出最后的错误
  throw new APIError(
    lastError?.message || '发送消息失败',
    lastError instanceof APIError ? lastError.status : undefined
  )
}

/**
 * 测试 API 连接
 * @returns Promise<boolean> - 连接是否成功
 */
export const testAPIConnection = async (): Promise<boolean> => {
  try {
    console.log('测试 Pollinations API 连接...')
    
    const response = await fetchWithTimeout(
      buildRequestURL('Hello', { model: 'openai' }),
      {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'User-Agent': 'PollinationsChat/1.0'
        }
      },
      5000 // 5秒超时用于测试
    )

    const isConnected = response.ok
    console.log(`API 连接测试${isConnected ? '成功' : '失败'}`)
    return isConnected

  } catch (error) {
    console.error('API 连接测试失败:', error)
    return false
  }
}

/**
 * 获取可用的模型列表
 * @returns 模型名称数组
 */
export const getAvailableModels = (): string[] => {
  return [
    'openai',      // OpenAI GPT 模型
    'claude',      // Anthropic Claude
    'mistral',     // Mistral AI
    'llama',       // Meta LLaMA
    'qwen',        // 阿里通义千问
    'deepseek'     // DeepSeek
  ]
}

/**
 * 获取模型的显示名称
 * @param model - 模型标识符
 * @returns 显示名称
 */
export const getModelDisplayName = (model: string): string => {
  const modelNames: Record<string, string> = {
    'openai': 'OpenAI GPT',
    'claude': 'Anthropic Claude',
    'mistral': 'Mistral AI',
    'llama': 'Meta LLaMA',
    'qwen': '阿里通义千问',
    'deepseek': 'DeepSeek'
  }
  return modelNames[model] || model
}

/**
 * 验证 API 请求参数
 * @param options - 请求选项
 */
export const validateAPIOptions = (options: Partial<PollinationsRequest>): void => {
  if (options.temperature !== undefined) {
    if (options.temperature < 0 || options.temperature > 1) {
      throw new APIError('temperature 必须在 0-1 之间')
    }
  }

  if (options.max_tokens !== undefined) {
    if (options.max_tokens < 1 || options.max_tokens > 4000) {
      throw new APIError('max_tokens 必须在 1-4000 之间')
    }
  }

  if (options.model && !getAvailableModels().includes(options.model)) {
    throw new APIError(`不支持的模型: ${options.model}`)
  }
} 