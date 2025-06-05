// 消息列表组件 - 显示所有聊天消息，包含加载状态和空状态
import React from 'react'
import type { MessageListProps } from '../../types/chat'
import { Message } from './Message'

/**
 * 加载指示器组件 - 显示AI正在思考的动画
 */
const LoadingIndicator: React.FC = () => (
  <div className="flex justify-start mb-4 animate-fade-in">
    <div className="max-w-[80%] md:max-w-[70%] lg:max-w-[60%] bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-animation"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-animation"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-animation"></div>
        </div>
        <span className="text-sm text-gray-500">AI 正在思考...</span>
      </div>
    </div>
  </div>
)

/**
 * 空状态组件 - 当没有消息时显示的欢迎界面
 */
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4">
    <div className="mb-6">
      {/* AI 图标 */}
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      
      {/* 欢迎文本 */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        欢迎使用 AI 聊天助手
      </h2>
      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
        我是基于 Pollinations.ai 的智能助手，可以帮您解答问题、进行对话、提供建议。
        请在下方输入您的问题开始聊天吧！
      </p>
    </div>

    {/* 示例问题 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm">解答问题</h3>
            <p className="text-gray-600 text-xs mt-1">询问任何您想了解的知识</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm">创作内容</h3>
            <p className="text-gray-600 text-xs mt-1">帮助您写作、翻译、总结</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm">头脑风暴</h3>
            <p className="text-gray-600 text-xs mt-1">激发创意，提供新想法</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm">学习辅导</h3>
            <p className="text-gray-600 text-xs mt-1">解释概念，提供学习建议</p>
          </div>
        </div>
      </div>
    </div>

    {/* 提示文本 */}
    <div className="mt-6 text-sm text-gray-500">
      💡 提示：您可以用中文或英文与我对话
    </div>
  </div>
)

/**
 * 消息列表组件 - 显示所有聊天消息
 */
export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading = false, 
  onRetry,
  className = '' 
}) => {
  // 如果没有消息且不在加载中，显示空状态
  if (messages.length === 0 && !isLoading) {
    return (
      <div className={`flex-1 ${className}`}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className={`flex-1 overflow-y-auto chat-scroll ${className}`}>
      <div className="p-4 space-y-0">
        {/* 渲染所有消息 */}
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onRetry={onRetry ? () => onRetry(message.id) : undefined}
          />
        ))}
        
        {/* 加载指示器 */}
        {isLoading && <LoadingIndicator />}
        
        {/* 底部间距，确保最后一条消息不会被输入框遮挡 */}
        <div className="h-4" />
      </div>
    </div>
  )
} 