// 聊天容器组件 - 整合消息列表和输入框，提供完整的聊天界面
import React, { useState } from 'react'
import type { ChatContainerProps } from '../../types/chat'
import { useChat } from '../../hooks/useChat'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

/**
 * 头部组件 - 显示标题和操作按钮
 */
const ChatHeader: React.FC<{
  title: string
  messageCount: number
  onClearMessages: () => void
  onExportChat: () => void
}> = ({ title, messageCount, onClearMessages, onExportChat }) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* 标题和状态 */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">
              {messageCount > 0 ? `${messageCount} 条消息` : '开始新对话'}
            </p>
          </div>
        </div>

        {/* 操作菜单 */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="更多选项"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* 下拉菜单 */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onExportChat()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>导出聊天记录</span>
              </button>
              
              <button
                onClick={() => {
                  onClearMessages()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                disabled={messageCount === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>清空聊天记录</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 点击外部关闭菜单 */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}

/**
 * 错误提示组件
 */
const ErrorBanner: React.FC<{
  error: string
  onDismiss: () => void
  onRetry?: () => void
}> = ({ error, onDismiss, onRetry }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-r-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-red-700">{error}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            重试
          </button>
        )}
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)

/**
 * 聊天容器组件 - 主要的聊天界面
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({
  className = '',
  title = 'AI 聊天助手'
}) => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryMessage,
    retryLastMessage,
    messagesContainerRef,
    inputRef,
    exportChatAsText,
    getMessageStats
  } = useChat()

  const [showError, setShowError] = useState(true)
  const messageStats = getMessageStats()

  /**
   * 处理导出聊天记录
   */
  const handleExportChat = () => {
    try {
      const chatText = exportChatAsText()
      const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `聊天记录_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('导出聊天记录失败:', error)
    }
  }

  /**
   * 处理错误消失
   */
  const handleDismissError = () => {
    setShowError(false)
  }

  /**
   * 重新显示错误（当有新错误时）
   */
  React.useEffect(() => {
    if (error) {
      setShowError(true)
    }
  }, [error])

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${className}`}>
      {/* 头部 */}
      <ChatHeader
        title={title}
        messageCount={messageStats.total}
        onClearMessages={clearMessages}
        onExportChat={handleExportChat}
      />

      {/* 错误提示 */}
      {error && showError && (
        <ErrorBanner
          error={error}
          onDismiss={handleDismissError}
          onRetry={retryLastMessage}
        />
      )}

      {/* 消息列表 */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-hidden"
      >
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onRetry={retryMessage}
        />
      </div>

      {/* 输入框 */}
      <MessageInput
        ref={inputRef}
        onSendMessage={sendMessage}
        disabled={isLoading}
        placeholder="输入您的消息..."
      />
    </div>
  )
} 