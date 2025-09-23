import 'dotenv/config'
import express = require('express')
import cors = require('cors')
import { connectDB } from './lib/db'
import cookieParser = require('cookie-parser')
import authRoutes from './routes/auth'
import meRoutes from './routes/me'
import auth0Routes from './routes/auth0'

const app = express()

const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000'

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/auth', authRoutes)
app.use('/', meRoutes)
app.use('/auth', auth0Routes)

async function start() {
  try {
    console.log('Booting server...')
    console.log('Connecting to Mongo...')
    await connectDB()
    console.log('Mongo connected')
  } catch (err) {
    console.error('DB connection failed', err)
  } finally {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
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


