// 通用工具函数 - 提供项目中使用的各种辅助功能

/**
 * 生成唯一 ID
 * @param prefix - ID 前缀（可选）
 * @returns 唯一标识符字符串
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36) // 时间戳转36进制
  const randomStr = Math.random().toString(36).substring(2, 8) // 随机字符串
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`
}

/**
 * 格式化时间戳为可读时间
 * @param timestamp - Unix 时间戳
 * @param format - 格式类型
 * @returns 格式化后的时间字符串
 */
export const formatTimestamp = (
  timestamp: number, 
  format: 'time' | 'datetime' | 'relative' = 'time'
): string => {
  const date = new Date(timestamp)
  const now = new Date()
  
  switch (format) {
    case 'time':
      // 显示时间，如 "14:30"
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    
    case 'datetime':
      // 显示完整日期时间，如 "2024-01-15 14:30"
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    
    case 'relative':
      // 显示相对时间，如 "刚刚"、"5分钟前"
      const diffMs = now.getTime() - timestamp
      const diffSeconds = Math.floor(diffMs / 1000)
      const diffMinutes = Math.floor(diffSeconds / 60)
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffSeconds < 60) return '刚刚'
      if (diffMinutes < 60) return `${diffMinutes}分钟前`
      if (diffHours < 24) return `${diffHours}小时前`
      if (diffDays < 7) return `${diffDays}天前`
      
      // 超过一周显示具体日期
      return formatTimestamp(timestamp, 'datetime')
    
    default:
      return date.toLocaleString('zh-CN')
  }
}

/**
 * 防抖函数 - 延迟执行，在指定时间内多次调用只执行最后一次
 * @param func - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * 节流函数 - 限制函数执行频率
 * @param func - 要节流的函数
 * @param delay - 节流间隔（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * 深拷贝对象
 * @param obj - 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * 检查字符串是否为空或只包含空白字符
 * @param str - 要检查的字符串
 * @returns 是否为空
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0
}

/**
 * 截断文本并添加省略号
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @param suffix - 后缀（默认为 "..."）
 * @returns 截断后的文本
 */
export const truncateText = (
  text: string, 
  maxLength: number, 
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) {
    return text
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * 将文本复制到剪贴板
 * @param text - 要复制的文本
 * @returns Promise<boolean> - 是否复制成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // 降级方案：使用传统的 document.execCommand
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return success
  } catch (error) {
    console.error('复制到剪贴板失败:', error)
    return false
  }
}

/**
 * 滚动到页面底部（平滑滚动）
 * @param element - 要滚动的元素（默认为 window）
 */
export const scrollToBottom = (element?: HTMLElement): void => {
  if (element) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth'
    })
  } else {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }
}

/**
 * 检查元素是否在视口中
 * @param element - 要检查的元素
 * @returns 是否在视口中
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 获取随机颜色（十六进制）
 * @returns 随机颜色字符串
 */
export const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否为有效邮箱
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证 URL 格式
 * @param url - URL 字符串
 * @returns 是否为有效 URL
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 设置本地存储项
   * @param key - 键名
   * @param value - 值（会自动序列化）
   */
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('设置本地存储失败:', error)
    }
  },
  
  /**
   * 获取本地存储项
   * @param key - 键名
   * @param defaultValue - 默认值
   * @returns 存储的值或默认值
   */
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('获取本地存储失败:', error)
      return defaultValue
    }
  },
  
  /**
   * 删除本地存储项
   * @param key - 键名
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('删除本地存储失败:', error)
    }
  },
  
  /**
   * 清空所有本地存储
   */
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('清空本地存储失败:', error)
    }
  }
} 