import express = require('express')
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any
import { AuthedRequest, requireAuth } from '../middleware/auth'

const router = express.Router()

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const user = await User.findById(req.userId).select('name email bio avatarUrl isAdmin')
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ user: { id: user.id, name: user.name, email: user.email, bio: user.bio, avatarUrl: user.avatarUrl, isAdmin: user.isAdmin } })
})

router.put('/me', requireAuth, async (req: AuthedRequest, res) => {
  const { name, bio, avatarUrl } = req.body
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ message: 'Not found' })
  
  if (name) user.name = name
  if (bio !== undefined) user.bio = bio
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl
  
  await user.save()
  res.json({ user: { id: user.id, name: user.name, email: user.email, bio: user.bio, avatarUrl: user.avatarUrl, isAdmin: user.isAdmin } })
})

export default router


