import express = require('express')
import { AuthedRequest, requireAuth } from '../middleware/auth'
const NotificationModule = require('../models/Notification')
const Notification = (NotificationModule && (NotificationModule.default || NotificationModule)) as any

const router = express.Router()

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
  const list = await (Notification as any)
    .find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('actorId', 'name')
  res.json({ notifications: list.map((n: any) => ({
    id: String(n._id),
    type: n.type,
    read: n.read,
    actorName: n.actorId?.name || 'Kullanıcı',
    postId: n.postId ? String(n.postId) : undefined,
    createdAt: n.createdAt,
  })) })
})

router.get('/unread-count', requireAuth, async (req: AuthedRequest, res) => {
  const count = await (Notification as any).countDocuments({ userId: req.userId, read: false })
  res.json({ count })
})

router.post('/:id/read', requireAuth, async (req: AuthedRequest, res) => {
  const n = await (Notification as any).findOne({ _id: req.params.id, userId: req.userId })
  if (!n) return res.status(404).json({ message: 'Not found' })
  n.read = true
  await n.save()
  res.json({ ok: true })
})

router.post('/read-all', requireAuth, async (req: AuthedRequest, res) => {
  await (Notification as any).updateMany({ userId: req.userId, read: false }, { $set: { read: true } })
  res.json({ ok: true })
})

export default router


