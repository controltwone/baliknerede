import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false

  connect(userId?: string) {
    if (this.socket?.connected) return

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
    
    this.socket = io(API_BASE, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
      this.isConnected = true
      
      if (userId) {
        this.socket?.emit('join', userId)
      }
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

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
