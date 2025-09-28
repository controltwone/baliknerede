"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useSocket } from '@/hooks/useSocket'

export default function DebugPage() {
  const { user, isAuthenticated } = useAuth()
  const { socket, isConnected, socketService } = useSocket()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    if (socket) {
      // Listen to all socket events
      socket.on('connect', () => {
        addLog('✅ Socket connected')
      })

      socket.on('disconnect', () => {
        addLog('❌ Socket disconnected')
      })

      socket.on('connect_error', (error) => {
        addLog(`❌ Connection error: ${error.message}`)
      })

      socket.on('post_created', (data) => {
        addLog(`📝 New post created: ${data.post?._id}`)
      })

      socket.on('post_like_updated', (data) => {
        addLog(`❤️ Post like updated: ${data.postId} - ${data.likeCount} likes`)
      })

      socket.on('post_view_updated', (data) => {
        addLog(`👁️ Post view updated: ${data.postId} - ${data.viewCount} views`)
      })

      socket.on('online_count_updated', (data) => {
        addLog(`👥 Online count updated: ${data.count} users`)
      })
    }

    return () => {
      if (socket) {
        socket.removeAllListeners()
      }
    }
  }, [socket])

  const testEmit = () => {
    if (socket) {
      socket.emit('test_event', { message: 'Test message' })
      addLog('📤 Test event emitted')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">WebSocket Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Socket Connected: {isConnected ? 'Yes' : 'No'}</span>
            </div>
            <div>User ID: {user?.id || 'Not logged in'}</div>
            <div>Socket ID: {socket?.id || 'N/A'}</div>
            <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
          </div>
          <button
            onClick={testEmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Emit
          </button>
        </div>

        {/* Logs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Event Logs</h2>
          <div className="h-64 overflow-y-auto bg-gray-100 dark:bg-gray-700 rounded p-3">
            {logs.length === 0 ? (
              <p className="text-gray-500">No events yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open this page in two different browser tabs</li>
          <li>Login with different accounts in each tab</li>
          <li>In one tab, create a new post</li>
          <li>Watch the logs in both tabs for real-time events</li>
          <li>Try liking posts and see the updates</li>
        </ol>
      </div>
    </div>
  )
}

