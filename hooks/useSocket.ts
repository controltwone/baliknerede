"use client"

import { useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import socketService from '@/lib/socket'

export function useSocket() {
  const { user, isAuthenticated } = useAuth()
  const hasConnected = useRef(false)

  useEffect(() => {
    if (isAuthenticated && user?.id && !hasConnected.current) {
      console.log('Connecting socket for user:', user.id)
      try {
        socketService.connect(user.id)
        hasConnected.current = true
      } catch (error) {
        console.warn('Socket connection failed, continuing without real-time features:', error)
      }
    } else if (!isAuthenticated || !user?.id) {
      if (hasConnected.current) {
        console.log('Disconnecting socket - user logged out')
        socketService.disconnect()
        hasConnected.current = false
      }
    }

    return () => {
      if (!isAuthenticated || !user?.id) {
        socketService.disconnect()
        hasConnected.current = false
      }
    }
  }, [isAuthenticated, user?.id])

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isSocketConnected(),
    socketService
  }
}
