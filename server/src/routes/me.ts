import express = require('express')
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any
import { AuthedRequest, requireAuth } from '../middleware/auth'

const router = express.Router()

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const user = await User.findById(req.userId).select('name email')
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ user: { id: user.id, name: user.name, email: user.email } })
})

export default router


