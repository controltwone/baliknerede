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
      socketService.connect(user.id)
      hasConnected.current = true
    } else if (!isAuthenticated && hasConnected.current) {
      console.log('Disconnecting socket')
      socketService.disconnect()
      hasConnected.current = false
    }

    return () => {
      if (!isAuthenticated) {
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
