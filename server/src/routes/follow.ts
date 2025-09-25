import express = require('express')
import { AuthedRequest, requireAuth } from '../middleware/auth'
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any
const NotificationModule = require('../models/Notification')
const Notification = (NotificationModule && (NotificationModule.default || NotificationModule)) as any

const router = express.Router()

router.post('/:userId', requireAuth, async (req: AuthedRequest, res) => {
  const targetId = req.params.userId
  if (String(targetId) === String(req.userId)) return res.status(400).json({ message: 'Kendini takip edemezsin' })
  const me = await (User as any).findById(req.userId)
  const target = await (User as any).findById(targetId)
  if (!me || !target) return res.status(404).json({ message: 'Not found' })
  const already = me.following.some((x: any) => String(x) === String(targetId))
  if (already) return res.status(400).json({ message: 'Already following' })
  me.following.push(target._id)
  target.followers.push(me._id)
  await me.save()
  await target.save()
  await (Notification as any).create({ userId: target._id, actorId: me._id, type: 'follow' })
  res.json({ ok: true })
})

router.delete('/:userId', requireAuth, async (req: AuthedRequest, res) => {
  const targetId = req.params.userId
  const me = await (User as any).findById(req.userId)
  const target = await (User as any).findById(targetId)
  if (!me || !target) return res.status(404).json({ message: 'Not found' })
  me.following = me.following.filter((x: any) => String(x) !== String(targetId))
  target.followers = target.followers.filter((x: any) => String(x) !== String(me._id))
  await me.save()
  await target.save()
  res.json({ ok: true })
})

export default router


