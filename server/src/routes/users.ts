import express = require('express')
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any

const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+"

const router = express.Router()

// GET /users/search?q=query - search users by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q || typeof q !== 'string') {
      return res.json({ users: [] })
    }
    
    const users = await User.find({
      name: { $regex: q, $options: 'i' }
    }).select('name avatarUrl').limit(10)
    
    const results = users.map((user: any) => ({
      id: String(user._id),
      name: user.name,
      avatarUrl: user.avatarUrl || DEFAULT_AVATAR
    }))
    
    res.json({ users: results })
  } catch (error) {
    console.error('User search failed:', error)
    res.status(500).json({ message: 'Search failed' })
  }
})

// GET /users/:id - public profile
router.get('/:id', async (req, res) => {
  const user = await (User as any).findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ id: String(user._id), name: user.name, avatarUrl: user.avatarUrl || DEFAULT_AVATAR, followers: (user.followers || []).length, following: (user.following || []).length })
})

// GET /users/:id/followers - list followers with names
router.get('/:id/followers', async (req, res) => {
  const user = await (User as any).findById(req.params.id).populate('followers', 'name avatarUrl')
  if (!user) return res.status(404).json({ message: 'Not found' })
  const list = (user.followers || []).map((u: any) => ({ id: String(u._id), name: u.name, avatarUrl: u.avatarUrl || DEFAULT_AVATAR }))
  res.json({ followers: list })
})

// GET /users/:id/following - list following with names
router.get('/:id/following', async (req, res) => {
  const user = await (User as any).findById(req.params.id).populate('following', 'name avatarUrl')
  if (!user) return res.status(404).json({ message: 'Not found' })
  const list = (user.following || []).map((u: any) => ({ id: String(u._id), name: u.name, avatarUrl: u.avatarUrl || DEFAULT_AVATAR }))
  res.json({ following: list })
})

// GET /users/:id/follow-status - check if current user follows this user
router.get('/:id/follow-status', async (req, res) => {
  try {
    const { id } = req.params
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    
    if (!token) {
      return res.json({ isFollowing: false })
    }
    
    const jwt = require('jsonwebtoken')
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as { sub: string }
    const currentUserId = payload.sub
    
    const currentUser = await User.findById(currentUserId)
    const isFollowing = currentUser?.following?.some((followId: any) => String(followId) === String(id)) || false
    
    res.json({ isFollowing })
  } catch (error) {
    console.error('Follow status check failed:', error)
    res.json({ isFollowing: false })
  }
})

export default router


