import express from 'express'
import { AuthedRequest, requireAuth } from '../middleware/auth'
import Report from '../models/Report'
import Post from '../models/Post'
import User from '../models/User'

const router = express.Router()

// Admin middleware
const requireAdmin = async (req: AuthedRequest, res: any, next: any) => {
  try {
    const user = await (User as any).findById(req.userId)
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  } catch (error) {
    res.status(500).json({ message: 'Admin check failed' })
  }
}

// GET /admin/reports - get all reports (admin only)
router.get('/reports', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  try {
    const reports = await (Report as any).find()
      .populate('postId', 'contentText imageUrl authorId createdAt')
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 }) // Yeni şikayetler üstte

    res.json({ reports })
  } catch (error) {
    console.error('Get reports failed:', error)
    res.status(500).json({ message: 'Get reports failed' })
  }
})

// PUT /admin/reports/:id/status - update report status (admin only)
router.put('/reports/:id/status', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  try {
    const { status, adminNotes } = req.body
    const report = await (Report as any).findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    ).populate('postId', 'contentText imageUrl authorId createdAt')
     .populate('reporterId', 'name email')

    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    res.json({ report })
  } catch (error) {
    console.error('Update report status failed:', error)
    res.status(500).json({ message: 'Update report status failed' })
  }
})

// DELETE /admin/posts/:id - delete post (admin only)
router.delete('/posts/:id', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  try {
    const post = await (Post as any).findByIdAndDelete(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Also delete related reports
    await (Report as any).deleteMany({ postId: req.params.id })

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post failed:', error)
    res.status(500).json({ message: 'Delete post failed' })
  }
})

// GET /admin/stats - get admin statistics (admin only)
router.get('/stats', requireAuth, requireAdmin, async (req: AuthedRequest, res) => {
  try {
    const totalReports = await (Report as any).countDocuments()
    const pendingReports = await (Report as any).countDocuments({ status: 'pending' })
    const totalPosts = await (Post as any).countDocuments()
    const totalUsers = await (User as any).countDocuments()

    res.json({
      totalReports,
      pendingReports,
      totalPosts,
      totalUsers
    })
  } catch (error) {
    console.error('Get admin stats failed:', error)
    res.status(500).json({ message: 'Get admin stats failed' })
  }
})

export default router
