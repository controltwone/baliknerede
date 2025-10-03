import express from 'express'
import User from '../models/User'
import { AuthedRequest, requireAuth } from '../middleware/auth'

const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+"

const router = express.Router()

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const user = await (User as any).findById(req.userId).select('name email bio avatarUrl isAdmin')
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ user: { id: user.id, name: user.name, email: user.email, bio: user.bio, avatarUrl: user.avatarUrl || DEFAULT_AVATAR, isAdmin: user.isAdmin } })
})

router.put('/me', requireAuth, async (req: AuthedRequest, res) => {
  const { name, bio, avatarUrl } = req.body
  const user = await (User as any).findById(req.userId)
  if (!user) return res.status(404).json({ message: 'Not found' })
  
  if (name) user.name = name
  if (bio !== undefined) user.bio = bio
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl
  
  await user.save()
  res.json({ user: { id: user.id, name: user.name, email: user.email, bio: user.bio, avatarUrl: user.avatarUrl, isAdmin: user.isAdmin } })
})

export default router


