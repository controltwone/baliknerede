"use client"

import React, { useState, useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { Users } from 'lucide-react'

export default function OnlineUsers() {
  const { socketService } = useSocket()
  const [onlineCount, setOnlineCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Listen for connection status
    const socket = socketService.getSocket()
    if (socket) {
      setIsConnected(socket.connected)
      
      socket.on('connect', () => {
        setIsConnected(true)
        // Request current online count
        socket.emit('get_online_count')
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      // Listen for online count updates
      socket.on('online_count_updated', (data) => {
        setOnlineCount(data.count)
      })

      // Listen for user status changes
      socket.on('user_status_changed', (data) => {
        if (data.status === 'online') {
          setOnlineCount(prev => prev + 1)
        } else if (data.status === 'offline') {
          setOnlineCount(prev => Math.max(0, prev - 1))
        }
      })
    }

    return () => {
      if (socket) {
        socket.removeListener('connect')
        socket.removeListener('disconnect')
        socket.removeListener('online_count_updated')
        socket.removeListener('user_status_changed')
      }
    }
  }, [socketService])

  if (!isConnected) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
      <Users className="h-4 w-4" />
      <span>{onlineCount} online</span>
    </div>
  )
}
