// 消息组件测试
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Message } from '../../src/components/Chat/Message'
import type { Message as MessageType } from '../../src/types/chat'

// 模拟工具函数
vi.mock('../../src/utils/helpers', () => ({
  formatTimestamp: vi.fn((timestamp) => new Date(timestamp).toLocaleString()),
  copyToClipboard: vi.fn(() => Promise.resolve(true))
}))

describe('Message 组件', () => {
  const mockUserMessage: MessageType = {
    id: 'test-1',
    role: 'user',
    content: '这是一条测试消息',
    timestamp: Date.now(),
    status: 'sent'
  }

  const mockAIMessage: MessageType = {
    id: 'test-2',
    role: 'ai',
    content: '这是 AI 的回复',
    timestamp: Date.now(),
    status: 'received'
  }

  it('应该正确渲染用户消息', () => {
    render(<Message message={mockUserMessage} />)
    
    expect(screen.getByText('这是一条测试消息')).toBeInTheDocument()
    // 检查消息容器是否有正确的用户消息样式
    const messageContainer = screen.getByText('这是一条测试消息').closest('.bg-primary-500')
    expect(messageContainer).toBeInTheDocument()
  })

  it('应该正确渲染 AI 消息', () => {
    render(<Message message={mockAIMessage} />)
    
    expect(screen.getByText('这是 AI 的回复')).toBeInTheDocument()
    // 检查消息容器是否有正确的 AI 消息样式
    const messageContainer = screen.getByText('这是 AI 的回复').closest('.bg-white')
    expect(messageContainer).toBeInTheDocument()
  })

  it('应该显示失败状态的消息', () => {
    const failedMessage: MessageType = {
      ...mockUserMessage,
      status: 'failed'
    }

    render(<Message message={failedMessage} onRetry={vi.fn()} />)
    
    expect(screen.getByText('发送失败')).toBeInTheDocument()
  })

  it('应该调用重试回调', () => {
    const onRetry = vi.fn()
    const failedMessage: MessageType = {
      ...mockUserMessage,
      status: 'failed'
    }

    render(<Message message={failedMessage} onRetry={onRetry} />)
    
    const retryButton = screen.getByTitle('重试发送')
    fireEvent.click(retryButton)
    
    expect(onRetry).toHaveBeenCalled()
  })

  it('应该显示发送中状态', () => {
    const sendingMessage: MessageType = {
      ...mockUserMessage,
      status: 'sending'
    }

    render(<Message message={sendingMessage} />)
    
    expect(screen.getByText('发送中...')).toBeInTheDocument()
  })

  it('应该正确显示用户和AI消息的布局', () => {
    const { rerender } = render(<Message message={mockUserMessage} />)
    
    // 用户消息应该右对齐
    const userMessageWrapper = screen.getByText('这是一条测试消息').closest('.justify-end')
    expect(userMessageWrapper).toBeInTheDocument()

    // AI 消息应该左对齐
    rerender(<Message message={mockAIMessage} />)
    const aiMessageWrapper = screen.getByText('这是 AI 的回复').closest('.justify-start')
    expect(aiMessageWrapper).toBeInTheDocument()
  })
}) 