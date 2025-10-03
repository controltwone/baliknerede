import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connectDB } from './lib/db'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth'
import meRoutes from './routes/me'
import auth0Routes from './routes/auth0'
import postsRoutes from './routes/posts'
import uploadRoutes from './routes/upload'
import followRoutes from './routes/follow'
import notificationRoutes from './routes/notifications'
import usersRoutes from './routes/users'
import adminRoutes from './routes/admin'

const app = express()
// Behind Render/Proxies so secure cookies and protocol detection work correctly
app.set('trust proxy', 1)
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true
  }
})

const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000'

// Allow both apex and www variants for CORS
function expandOrigins(origin: string): string[] {
  try {
    const url = new URL(origin)
    const isWww = url.hostname.startsWith('www.')
    const apex = isWww ? url.hostname.replace(/^www\./, '') : url.hostname
    const www = isWww ? url.hostname : `www.${url.hostname}`
    const base = `${url.protocol}//`
    return [
      `${base}${apex}`,
      `${base}${www}`,
    ]
  } catch {
    return [origin]
  }
}
const ALLOWED_ORIGINS = new Set(expandOrigins(CLIENT_ORIGIN))

app.use(cors({
  origin: (requestOrigin, callback) => {
    if (!requestOrigin) return callback(null, true)
    try {
      const url = new URL(requestOrigin)
      const hostname = url.hostname
      const protocol = url.protocol
      const apex = hostname.replace(/^www\./, '')
      const www = hostname.startsWith('www.') ? hostname : `www.${hostname}`
      const candidates = new Set([
        `${protocol}//${hostname}`,
        `${protocol}//${apex}`,
        `${protocol}//${www}`,
      ])
      const allowed = Array.from(candidates).some((c) => ALLOWED_ORIGINS.has(c))
      return allowed ? callback(null, true) : callback(new Error('CORS not allowed'))
    } catch {
      return callback(new Error('CORS origin parse failed'))
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '6mb' }))
app.use(express.urlencoded({ extended: true, limit: '6mb' }))
app.use(cookieParser())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/auth', authRoutes)
app.use('/', meRoutes)
app.use('/', auth0Routes)
app.use('/posts', postsRoutes)
app.use('/upload', uploadRoutes)
app.use('/follow', followRoutes)
app.use('/notifications', notificationRoutes)
app.use('/users', usersRoutes)
app.use('/admin', adminRoutes)

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // User joins with their ID
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`)
    console.log(`User ${userId} joined room`)
  })

  // Relay direct notification events if needed (reserved)
  socket.on('notification_emit', (data) => {
    const { userId, payload } = data || {}
    if (userId) {
      io.to(`user_${userId}`).emit('notification_new', payload)
    }
  })

  // Handle post like updates
  socket.on('post_liked', (data) => {
    socket.broadcast.emit('post_like_updated', data)
  })

  // Handle post view updates
  socket.on('post_viewed', (data) => {
    socket.broadcast.emit('post_view_updated', data)
  })

  // Handle new posts
  socket.on('new_post', (data) => {
    socket.broadcast.emit('post_created', data)
  })

  // Handle user online status
  socket.on('user_online', (userId) => {
    socket.broadcast.emit('user_status_changed', { userId, status: 'online' })
  })

  // Handle get online count
  socket.on('get_online_count', () => {
    const count = io.engine.clientsCount
    socket.emit('online_count_updated', { count })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    // Broadcast online count update
    const count = io.engine.clientsCount - 1
    socket.broadcast.emit('online_count_updated', { count })
  })
})

// Make io available to routes
app.set('io', io)

async function start() {
  try {
    console.log('Booting server...')
    console.log('Connecting to Mongo...')
    await connectDB()
    console.log('Mongo connected')
  } catch (err) {
    console.error('DB connection failed', err)
  } finally {
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
      console.log(`Socket.IO server ready`)
    })
  }
}

start()

process.on('unhandledRejection', (err) => {
  console.error('UnhandledRejection', err)
})
process.on('uncaughtException', (err) => {
  console.error('UncaughtException', err)
})


