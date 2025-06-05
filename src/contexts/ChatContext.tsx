// 聊天上下文 - 使用 React Context API 管理全局聊天状态
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import type { ChatState, ChatActions, Message, MessageStatus } from '../types/chat'
import { sendChatMessage } from '../services/pollinations'
import { generateId, storage } from '../utils/helpers'

// 聊天状态的初始值
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  conversationId: null
}

// 聊天状态操作类型
type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'LOAD_MESSAGES'; payload: Message[] }
  | { type: 'SET_CONVERSATION_ID'; payload: string | null }

// 聊天状态 Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null // 添加新消息时清除错误
      }
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        )
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false // 设置错误时停止加载状态
      }
    
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        error: null,
        conversationId: null
      }
    
    case 'LOAD_MESSAGES':
      return {
        ...state,
        messages: action.payload
      }
    
    case 'SET_CONVERSATION_ID':
      return {
        ...state,
        conversationId: action.payload
      }
    
    default:
      return state
  }
}

// 创建聊天上下文
const ChatContext = createContext<(ChatState & ChatActions) | null>(null)

// 本地存储键名
const STORAGE_KEYS = {
  MESSAGES: 'chat_messages',
  CONVERSATION_ID: 'chat_conversation_id'
} as const

/**
 * 聊天上下文提供者组件
 */
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  // 从本地存储加载聊天历史
  useEffect(() => {
    try {
      const savedMessages = storage.get<Message[]>(STORAGE_KEYS.MESSAGES, [])
      const savedConversationId = storage.get<string | null>(STORAGE_KEYS.CONVERSATION_ID, null)
      
      if (savedMessages.length > 0) {
        dispatch({ type: 'LOAD_MESSAGES', payload: savedMessages })
      }
      
      if (savedConversationId) {
        dispatch({ type: 'SET_CONVERSATION_ID', payload: savedConversationId })
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error)
    }
  }, [])

  // 保存消息到本地存储
  useEffect(() => {
    if (state.messages.length > 0) {
      storage.set(STORAGE_KEYS.MESSAGES, state.messages)
    }
  }, [state.messages])

  // 保存对话 ID 到本地存储
  useEffect(() => {
    if (state.conversationId) {
      storage.set(STORAGE_KEYS.CONVERSATION_ID, state.conversationId)
    }
  }, [state.conversationId])

  /**
   * 发送消息
   */
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) {
      dispatch({ type: 'SET_ERROR', payload: '消息内容不能为空' })
      return
    }

    // 创建用户消息
    const userMessage: Message = {
      id: generateId('msg'),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      status: 'sent'
    }

    // 添加用户消息到状态
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // 准备发送给 API 的消息历史（包括新的用户消息）
      const messagesForAPI = [...state.messages, userMessage]
      
      // 调用 API 获取 AI 响应
      const aiResponse = await sendChatMessage(messagesForAPI, {
        model: 'openai',
        temperature: 0.7
      })

      // 创建 AI 响应消息
      const aiMessage: Message = {
        id: generateId('msg'),
        role: 'ai',
        content: aiResponse,
        timestamp: Date.now(),
        status: 'received'
      }

      // 添加 AI 响应到状态
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage })

      // 如果没有对话 ID，生成一个新的
      if (!state.conversationId) {
        const newConversationId = generateId('conv')
        dispatch({ type: 'SET_CONVERSATION_ID', payload: newConversationId })
      }

    } catch (error) {
      console.error('发送消息失败:', error)
      
      // 更新用户消息状态为失败
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          id: userMessage.id, 
          updates: { status: 'failed' } 
        } 
      })

      // 设置错误信息
      const errorMessage = error instanceof Error ? error.message : '发送消息失败，请重试'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.messages, state.conversationId])

  /**
   * 清空消息历史
   */
  const clearMessages = useCallback((): void => {
    dispatch({ type: 'CLEAR_MESSAGES' })
    storage.remove(STORAGE_KEYS.MESSAGES)
    storage.remove(STORAGE_KEYS.CONVERSATION_ID)
  }, [])

  /**
   * 重试最后一条失败的消息
   */
  const retryLastMessage = useCallback(async (): Promise<void> => {
    // 找到最后一条失败的用户消息
    const failedMessage = state.messages
      .filter(msg => msg.role === 'user' && msg.status === 'failed')
      .pop()

    if (!failedMessage) {
      dispatch({ type: 'SET_ERROR', payload: '没有找到需要重试的消息' })
      return
    }

    // 更新消息状态为发送中
    dispatch({ 
      type: 'UPDATE_MESSAGE', 
      payload: { 
        id: failedMessage.id, 
        updates: { status: 'sending' } 
      } 
    })

    // 重新发送消息
    await sendMessage(failedMessage.content)
  }, [state.messages, sendMessage])

  /**
   * 更新消息状态
   */
  const updateMessageStatus = useCallback((id: string, status: MessageStatus): void => {
    dispatch({ 
      type: 'UPDATE_MESSAGE', 
      payload: { 
        id, 
        updates: { status } 
      } 
    })
  }, [])

  // 组合状态和操作
  const contextValue: ChatState & ChatActions = {
    ...state,
    sendMessage,
    clearMessages,
    retryLastMessage,
    updateMessageStatus
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

/**
 * 使用聊天上下文的 Hook
 * @returns 聊天状态和操作函数
 */
export const useChat = (): ChatState & ChatActions => {
  const context = useContext(ChatContext)
  
  if (!context) {
    throw new Error('useChat 必须在 ChatProvider 内部使用')
  }
  
  return context
} 