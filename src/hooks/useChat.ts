// 自定义聊天 Hook - 提供额外的聊天功能和状态管理
import { useCallback, useEffect, useRef } from 'react'
import { useChat as useChatContext } from '../contexts/ChatContext'
import { scrollToBottom, debounce } from '../utils/helpers'
import type { Message } from '../types/chat'

/**
 * 扩展的聊天 Hook，提供额外功能
 */
export const useChat = () => {
  // 获取基础聊天上下文
  const chatContext = useChatContext()
  
  // 消息容器引用，用于自动滚动
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  
  // 输入框引用，用于自动聚焦
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * 自动滚动到底部（防抖处理）
   */
  const scrollToBottomDebounced = useCallback(
    debounce(() => {
      if (messagesContainerRef.current) {
        scrollToBottom(messagesContainerRef.current)
      }
    }, 100),
    []
  )

  /**
   * 当有新消息时自动滚动到底部
   */
  useEffect(() => {
    if (chatContext.messages.length > 0) {
      scrollToBottomDebounced()
    }
  }, [chatContext.messages, scrollToBottomDebounced])

  /**
   * 自动聚焦输入框
   */
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  /**
   * 页面加载时自动聚焦输入框
   */
  useEffect(() => {
    // 延迟聚焦，确保组件已完全渲染
    const timer = setTimeout(focusInput, 100)
    return () => clearTimeout(timer)
  }, [focusInput])

  /**
   * 获取最后一条消息
   */
  const getLastMessage = useCallback((): Message | null => {
    const { messages } = chatContext
    return messages.length > 0 ? messages[messages.length - 1] : null
  }, [chatContext.messages])

  /**
   * 获取最后一条用户消息
   */
  const getLastUserMessage = useCallback((): Message | null => {
    const { messages } = chatContext
    const userMessages = messages.filter(msg => msg.role === 'user')
    return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null
  }, [chatContext.messages])

  /**
   * 获取最后一条 AI 消息
   */
  const getLastAIMessage = useCallback((): Message | null => {
    const { messages } = chatContext
    const aiMessages = messages.filter(msg => msg.role === 'ai')
    return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null
  }, [chatContext.messages])

  /**
   * 检查是否有失败的消息
   */
  const hasFailedMessages = useCallback((): boolean => {
    return chatContext.messages.some(msg => msg.status === 'failed')
  }, [chatContext.messages])

  /**
   * 获取失败的消息列表
   */
  const getFailedMessages = useCallback((): Message[] => {
    return chatContext.messages.filter(msg => msg.status === 'failed')
  }, [chatContext.messages])

  /**
   * 重试指定的消息
   */
  const retryMessage = useCallback(async (messageId: string): Promise<void> => {
    const message = chatContext.messages.find(msg => msg.id === messageId)
    
    if (!message) {
      console.error('未找到要重试的消息')
      return
    }

    if (message.role !== 'user') {
      console.error('只能重试用户消息')
      return
    }

    // 更新消息状态为发送中
    chatContext.updateMessageStatus(messageId, 'sending')
    
    try {
      // 重新发送消息
      await chatContext.sendMessage(message.content)
      
      // 更新消息状态为已发送
      chatContext.updateMessageStatus(messageId, 'sent')
    } catch (error) {
      // 重试失败，恢复失败状态
      chatContext.updateMessageStatus(messageId, 'failed')
      console.error('重试消息失败:', error)
    }
  }, [chatContext])

  /**
   * 获取消息统计信息
   */
  const getMessageStats = useCallback(() => {
    const { messages } = chatContext
    
    return {
      total: messages.length,
      user: messages.filter(msg => msg.role === 'user').length,
      ai: messages.filter(msg => msg.role === 'ai').length,
      failed: messages.filter(msg => msg.status === 'failed').length,
      sending: messages.filter(msg => msg.status === 'sending').length
    }
  }, [chatContext.messages])

  /**
   * 检查是否可以发送消息
   */
  const canSendMessage = useCallback((): boolean => {
    return !chatContext.isLoading && !chatContext.error
  }, [chatContext.isLoading, chatContext.error])

  /**
   * 发送消息的增强版本，包含额外的验证和处理
   */
  const sendMessageEnhanced = useCallback(async (content: string): Promise<void> => {
    // 检查是否可以发送消息
    if (!canSendMessage()) {
      console.warn('当前无法发送消息')
      return
    }

    // 检查消息内容
    if (!content || content.trim().length === 0) {
      console.warn('消息内容不能为空')
      return
    }

    // 检查消息长度
    if (content.length > 2000) {
      console.warn('消息内容过长，请控制在2000字符以内')
      return
    }

    try {
      await chatContext.sendMessage(content)
      
      // 发送成功后聚焦输入框
      setTimeout(focusInput, 100)
    } catch (error) {
      console.error('发送消息失败:', error)
    }
  }, [chatContext.sendMessage, canSendMessage, focusInput])

  /**
   * 清空消息的增强版本，包含确认
   */
  const clearMessagesWithConfirm = useCallback((): void => {
    if (chatContext.messages.length === 0) {
      return
    }

    const confirmed = window.confirm('确定要清空所有聊天记录吗？此操作不可撤销。')
    if (confirmed) {
      chatContext.clearMessages()
      // 清空后聚焦输入框
      setTimeout(focusInput, 100)
    }
  }, [chatContext.clearMessages, chatContext.messages.length, focusInput])

  /**
   * 导出聊天记录为文本
   */
  const exportChatAsText = useCallback((): string => {
    const { messages } = chatContext
    
    if (messages.length === 0) {
      return '暂无聊天记录'
    }

    const chatText = messages.map(msg => {
      const timestamp = new Date(msg.timestamp).toLocaleString('zh-CN')
      const role = msg.role === 'user' ? '用户' : 'AI助手'
      return `[${timestamp}] ${role}: ${msg.content}`
    }).join('\n\n')

    return `AI聊天记录\n生成时间: ${new Date().toLocaleString('zh-CN')}\n\n${chatText}`
  }, [chatContext.messages])

  /**
   * 导出聊天记录为 JSON
   */
  const exportChatAsJSON = useCallback((): string => {
    const exportData = {
      exportTime: new Date().toISOString(),
      conversationId: chatContext.conversationId,
      messageCount: chatContext.messages.length,
      messages: chatContext.messages
    }

    return JSON.stringify(exportData, null, 2)
  }, [chatContext.messages, chatContext.conversationId])

  // 返回增强的聊天功能
  return {
    // 基础聊天上下文
    ...chatContext,
    
    // 引用
    messagesContainerRef,
    inputRef,
    
    // 增强功能
    sendMessage: sendMessageEnhanced,
    clearMessages: clearMessagesWithConfirm,
    retryMessage,
    focusInput,
    
    // 消息查询
    getLastMessage,
    getLastUserMessage,
    getLastAIMessage,
    hasFailedMessages,
    getFailedMessages,
    getMessageStats,
    
    // 状态检查
    canSendMessage,
    
    // 导出功能
    exportChatAsText,
    exportChatAsJSON
  }
} 