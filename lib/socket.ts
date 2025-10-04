import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false

  connect(userId?: string) {
    if (this.socket?.connected) return

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
    
    try {
      this.socket = io(API_BASE, {
        transports: ['websocket'], // Sadece websocket, polling yok
        autoConnect: true,
        timeout: 10000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      })

      this.socket.on('connect', () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Socket connected:', this.socket?.id)
        }
        this.isConnected = true
        
        if (userId) {
          this.socket?.emit('join', userId)
        }
      })

      this.socket.on('disconnect', (reason) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Socket disconnected:', reason)
        }
        this.isConnected = false
      })

      this.socket.on('connect_error', (error) => {
        console.warn('Socket connection error (will retry):', error.message)
        this.isConnected = false
      })

      this.socket.on('error', (error) => {
        console.warn('Socket error:', error)
      })

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts')
        this.isConnected = true
        
        if (userId) {
          this.socket?.emit('join', userId)
        }
      })

      this.socket.on('reconnect_error', (error) => {
        console.warn('Socket reconnection error:', error.message)
      })

      this.socket.on('reconnect_failed', () => {
        console.warn('Socket reconnection failed - giving up')
        this.isConnected = false
      })

    } catch (error) {
      console.warn('Failed to initialize socket:', error)
      this.isConnected = false
    }

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  getSocket() {
    return this.socket
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected
  }

  // Event listeners
  onPostLikeUpdated(callback: (data: any) => void) {
    this.socket?.on('post_like_updated', callback)
  }

  onPostViewUpdated(callback: (data: any) => void) {
    this.socket?.on('post_view_updated', callback)
  }

  onPostCreated(callback: (data: any) => void) {
    this.socket?.on('post_created', callback)
  }

  onUserStatusChanged(callback: (data: any) => void) {
    this.socket?.on('user_status_changed', callback)
  }

  onNotificationNew(callback: (data: any) => void) {
    this.socket?.on('notification_new', callback)
  }

  // Event emitters
  emitPostLiked(data: any) {
    this.socket?.emit('post_liked', data)
  }

  emitPostViewed(data: any) {
    this.socket?.emit('post_viewed', data)
  }

  emitNewPost(data: any) {
    this.socket?.emit('new_post', data)
  }

  emitUserOnline(userId: string) {
    this.socket?.emit('user_online', userId)
  }

  emitNotification(userId: string, payload: any) {
    this.socket?.emit('notification_emit', { userId, payload })
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners()
  }

  removeListener(event: string, callback?: any) {
    this.socket?.removeListener(event, callback)
  }
}

// Singleton instance
export const socketService = new SocketService()
export default socketService
