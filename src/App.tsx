// 主应用组件 - 整合所有功能，提供完整的聊天应用
import React from 'react'
import { ChatProvider } from './contexts/ChatContext'
import { ChatContainer } from './components/Chat/ChatContainer'

/**
 * 主应用组件
 */
const App: React.FC = () => {
  return (
    <ChatProvider>
      <div className="App">
        <ChatContainer 
          title="AI 聊天助手 - Pollinations Chat"
          className="h-screen"
        />
      </div>
    </ChatProvider>
  )
}

export default App 