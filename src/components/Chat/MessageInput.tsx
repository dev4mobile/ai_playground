// 消息输入组件 - 处理用户输入和消息发送
import React, { useState, useRef, useEffect, forwardRef } from 'react'
import type { MessageInputProps } from '../../types/chat'
import { isEmpty } from '../../utils/helpers'

/**
 * 消息输入组件 - 提供文本输入和发送功能
 */
export const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(({
  onSendMessage,
  disabled = false,
  placeholder = '输入您的消息...',
  className = ''
}, ref) => {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false) // 处理中文输入法
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 合并外部 ref 和内部 ref
  const combinedRef = (ref as React.RefObject<HTMLTextAreaElement>) || textareaRef

  /**
   * 自动调整文本框高度
   */
  const adjustTextareaHeight = () => {
    const textarea = combinedRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 120 // 最大高度约5行
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }

  /**
   * 处理输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  /**
   * 处理发送消息
   */
  const handleSendMessage = () => {
    if (disabled || isEmpty(message) || isComposing) {
      return
    }

    const trimmedMessage = message.trim()
    if (trimmedMessage) {
      onSendMessage(trimmedMessage)
      setMessage('')
      
      // 重置文本框高度
      if (combinedRef.current) {
        combinedRef.current.style.height = 'auto'
      }
    }
  }

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 发送消息（Shift+Enter 换行）
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSendMessage()
    }
    
    // Escape 清空输入
    if (e.key === 'Escape') {
      setMessage('')
      if (combinedRef.current) {
        combinedRef.current.style.height = 'auto'
      }
    }
  }

  /**
   * 处理中文输入法开始
   */
  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  /**
   * 处理中文输入法结束
   */
  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  /**
   * 当消息内容变化时调整高度
   */
  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  /**
   * 组件挂载时聚焦输入框
   */
  useEffect(() => {
    if (combinedRef.current && !disabled) {
      combinedRef.current.focus()
    }
  }, [disabled])

  // 检查是否可以发送消息
  const canSend = !disabled && !isEmpty(message) && !isComposing

  return (
    <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          {/* 文本输入区域 */}
          <div className="flex-1 relative">
            <textarea
              ref={combinedRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={disabled ? '正在处理中，请稍候...' : placeholder}
              disabled={disabled}
              rows={1}
              className={`
                w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300
                resize-none overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                transition-all duration-200
                ${disabled ? 'opacity-50' : ''}
              `}
              style={{ minHeight: '48px' }}
            />
            
            {/* 字符计数 */}
            {message.length > 1800 && (
              <div className={`
                absolute bottom-1 right-12 text-xs px-2 py-1 rounded
                ${message.length > 2000 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-orange-600 bg-orange-50'
                }
              `}>
                {message.length}/2000
              </div>
            )}
          </div>

          {/* 发送按钮 */}
          <button
            onClick={handleSendMessage}
            disabled={!canSend}
            className={`
              p-3 rounded-2xl transition-all duration-200 flex-shrink-0
              ${canSend
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            title={canSend ? '发送消息 (Enter)' : '请输入消息内容'}
          >
            {disabled ? (
              // 加载动画
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              // 发送图标
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* 提示文本 */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>按 Enter 发送，Shift+Enter 换行</span>
            {message.length > 0 && (
              <span>按 Esc 清空</span>
            )}
          </div>
          
          {/* 状态指示器 */}
          <div className="flex items-center space-x-2">
            {disabled && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span>AI 正在回复...</span>
              </div>
            )}
            
            {!disabled && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>就绪</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}) 