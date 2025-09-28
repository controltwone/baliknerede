import express = require('express')
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any

const router = express.Router()

// GET /users/:id - public profile
router.get('/:id', async (req, res) => {
  const user = await (User as any).findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ id: String(user._id), name: user.name, avatarUrl: user.avatarUrl, followers: (user.followers || []).length, following: (user.following || []).length })
})

// GET /users/:id/followers - list followers with names
router.get('/:id/followers', async (req, res) => {
  const user = await (User as any).findById(req.params.id).populate('followers', 'name avatarUrl')
  if (!user) return res.status(404).json({ message: 'Not found' })
  const list = (user.followers || []).map((u: any) => ({ id: String(u._id), name: u.name, avatarUrl: u.avatarUrl }))
  res.json({ followers: list })
})

// GET /users/:id/following - list following with names
router.get('/:id/following', async (req, res) => {
  const user = await (User as any).findById(req.params.id).populate('following', 'name avatarUrl')
  if (!user) return res.status(404).json({ message: 'Not found' })
  const list = (user.following || []).map((u: any) => ({ id: String(u._id), name: u.name, avatarUrl: u.avatarUrl }))
  res.json({ following: list })
})

export default router


