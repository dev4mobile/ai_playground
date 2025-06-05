// 单条消息组件 - 显示用户或AI的消息，支持不同样式和状态
import React, { useState } from 'react'
import type { MessageProps } from '../../types/chat'
import { formatTimestamp, copyToClipboard } from '../../utils/helpers'

/**
 * 消息组件 - 渲染单条聊天消息
 */
export const Message: React.FC<MessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  const [showTimestamp, setShowTimestamp] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // 判断是否为用户消息
  const isUser = message.role === 'user'
  
  // 判断是否为失败状态
  const isFailed = message.status === 'failed'
  
  // 判断是否为发送中状态
  const isSending = message.status === 'sending'

  /**
   * 复制消息内容到剪贴板
   */
  const handleCopyMessage = async () => {
    const success = await copyToClipboard(message.content)
    setCopySuccess(success)
    
    if (success) {
      // 2秒后重置复制状态
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  /**
   * 处理重试操作
   */
  const handleRetry = () => {
    if (onRetry && isFailed) {
      onRetry()
    }
  }

  /**
   * 切换时间戳显示
   */
  const toggleTimestamp = () => {
    setShowTimestamp(!showTimestamp)
  }

  return (
    <div 
      className={`
        flex w-full mb-4 animate-fade-in
        ${isUser ? 'justify-end' : 'justify-start'}
        ${className}
      `}
    >
      <div 
        className={`
          max-w-[80%] md:max-w-[70%] lg:max-w-[60%] 
          rounded-2xl px-4 py-3 shadow-sm
          ${isUser 
            ? 'bg-primary-500 text-white rounded-br-md' 
            : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
          }
          ${isFailed ? 'border-red-300 bg-red-50' : ''}
          ${isSending ? 'opacity-70' : ''}
          transition-all duration-200 hover:shadow-md
        `}
      >
        {/* 消息内容 */}
        <div className="relative group">
          {/* 消息文本 */}
          <div 
            className={`
              text-sm leading-relaxed whitespace-pre-wrap break-words
              ${isUser ? 'text-white' : 'text-gray-800'}
              ${isFailed ? 'text-red-700' : ''}
            `}
          >
            {message.content}
          </div>

          {/* 发送中状态指示器 */}
          {isSending && (
            <div className="flex items-center mt-2 text-xs opacity-70">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full typing-animation"></div>
                <div className="w-2 h-2 bg-current rounded-full typing-animation"></div>
                <div className="w-2 h-2 bg-current rounded-full typing-animation"></div>
              </div>
              <span className="ml-2">发送中...</span>
            </div>
          )}

          {/* 失败状态指示器 */}
          {isFailed && (
            <div className="flex items-center mt-2 text-xs text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>发送失败</span>
            </div>
          )}

          {/* 操作按钮 - 在悬停时显示 */}
          <div className={`
            absolute top-0 right-0 transform translate-x-full
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            flex items-center space-x-1 ml-2
            ${isUser ? '-translate-x-full mr-2' : ''}
          `}>
            {/* 复制按钮 */}
            <button
              onClick={handleCopyMessage}
              className={`
                p-1.5 rounded-lg transition-colors duration-200
                ${isUser 
                  ? 'hover:bg-primary-600 text-primary-100' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
              title="复制消息"
            >
              {copySuccess ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* 重试按钮 - 仅在失败时显示 */}
            {isFailed && onRetry && (
              <button
                onClick={handleRetry}
                className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors duration-200"
                title="重试发送"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 时间戳按钮 */}
            <button
              onClick={toggleTimestamp}
              className={`
                p-1.5 rounded-lg transition-colors duration-200
                ${isUser 
                  ? 'hover:bg-primary-600 text-primary-100' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
              title="显示时间"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 时间戳 - 点击时间按钮后显示 */}
        {showTimestamp && (
          <div className={`
            mt-2 text-xs opacity-70
            ${isUser ? 'text-primary-100' : 'text-gray-500'}
          `}>
            {formatTimestamp(message.timestamp, 'datetime')}
          </div>
        )}

        {/* 状态指示器 */}
        <div className={`
          mt-1 flex items-center justify-end text-xs opacity-60
          ${isUser ? 'text-primary-100' : 'text-gray-400'}
        `}>
          {message.status === 'sent' && isUser && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {message.status === 'received' && !isUser && (
            <span>AI</span>
          )}
        </div>
      </div>
    </div>
  )
} 