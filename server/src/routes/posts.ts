import express = require('express')
const PostModule = require('../models/Post')
const Post = (PostModule && (PostModule.default || PostModule)) as any
import { AuthedRequest, requireAuth } from '../middleware/auth'
const NotificationModule = require('../models/Notification')
const Notification = (NotificationModule && (NotificationModule.default || NotificationModule)) as any
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any

const router = express.Router()

// GET /posts - list latest posts (with author name)
router.get('/', async (req, res) => {
  const posts = await (Post as any)
    .find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('authorId', 'name avatarUrl')
  
  // Eğer kullanıcı giriş yapmışsa beğeni durumunu ekle
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  
  if (token) {
    try {
      const jwt = require('jsonwebtoken')
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as { sub: string }
      const userId = payload.sub
      
      const postsWithLikes = posts.map((post: any) => ({
        ...post.toObject(),
        liked: post.likes.some((likeId: any) => String(likeId) === String(userId))
      }))
      
      return res.json({ posts: postsWithLikes })
    } catch (e) {
      // Token geçersizse normal posts döndür
    }
  }
  
  res.json({ posts })
})
// GET /posts/by/:userId - list posts by user
router.get('/by/:userId', async (req, res) => {
  const posts = await (Post as any)
    .find({ authorId: req.params.userId })
    .sort({ createdAt: -1 })
    .populate('authorId', 'name avatarUrl')
  res.json({ posts })
})

// POST /posts - create post (auth)
router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const { contentText, imageUrl, locationCity, locationSpot } = req.body || {}
  const doc = await Post.create({
    authorId: req.userId,
    contentText,
    imageUrl,
    locationCity,
    locationSpot,
  })
  try {
    const author = await (User as any).findById(req.userId)
    const followerIds = author?.followers || []
    if (followerIds.length) {
      const bulk = followerIds.map((fid: any) => ({
        userId: fid,
        actorId: author._id,
        type: 'new_post',
        postId: doc._id,
      }))
      await (Notification as any).insertMany(bulk)
    }
  } catch (e) {}
  
  // Emit socket event for new post
  const io = req.app.get('io')
  if (io) {
    const populatedPost = await Post.findById(doc._id).populate('authorId', 'name avatarUrl')
    io.emit('post_created', {
      post: populatedPost,
      author: populatedPost?.authorId
    })
  }
  
  res.status(201).json({ post: doc })
})

// POST /posts/:id/like - toggle like (auth)
router.post('/:id/like', requireAuth, async (req: AuthedRequest, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  const uid = req.userId as any
  const has = post.likes.some((x: any) => String(x) === String(uid))
  if (has) {
    post.likes = post.likes.filter((x: any) => String(x) !== String(uid))
  } else {
    post.likes.push(uid)
  }
  post.likeCount = post.likes.length
  await post.save()
  
  // Emit socket event for real-time updates
  const io = req.app.get('io')
  if (io) {
    io.emit('post_like_updated', {
      postId: req.params.id,
      likeCount: post.likeCount,
      liked: !has
    })
  }
  
  res.json({ likeCount: post.likeCount, liked: !has })
})

// POST /posts/:id/comments - add comment (auth)
router.post('/:id/comments', requireAuth, async (req: AuthedRequest, res) => {
  const { text } = req.body || {}
  if (!text) return res.status(400).json({ message: 'text is required' })
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  post.comments.push({ userId: req.userId as any, text, createdAt: new Date() } as any)
  post.commentCount = post.comments.length
  await post.save()
  res.status(201).json({ commentCount: post.commentCount })
})

// GET /posts/:id/comments - list comments
router.get('/:id/comments', async (req, res) => {
  const post = await (Post as any)
    .findById(req.params.id)
    .populate('comments.userId', 'name')
  if (!post) return res.status(404).json({ message: 'Not found' })
  const comments = (post.comments || [])
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Yeni yorumlar üstte
    .map((c: any) => ({
      userId: String(c.userId?._id || c.userId),
      userName: c.userId?.name || 'Kullanıcı',
      text: c.text,
      createdAt: c.createdAt,
    }))
  res.json({ comments })
})

// GET /posts/my - current user's posts
router.get('/my', requireAuth, async (req: AuthedRequest, res) => {
  const posts = await (Post as any)
    .find({ authorId: req.userId })
    .sort({ createdAt: -1 })
  res.json({ posts })
})

// POST /posts/:id/view - increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Not found' })
    
    post.viewCount = (post.viewCount || 0) + 1
    await post.save()
    
    // Emit socket event for view count update
    const io = req.app.get('io')
    if (io) {
      io.emit('post_view_updated', {
        postId: req.params.id,
        viewCount: post.viewCount
      })
    }
    
    res.json({ viewCount: post.viewCount })
  } catch (error) {
    console.error('View count update failed:', error)
    res.status(500).json({ message: 'View count update failed' })
  }
})

// DELETE /posts/:id - delete a post (only by author)
router.delete('/:id', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Check if user is the author
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' })
    }

    await Post.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post failed:', error)
    res.status(500).json({ message: 'Delete post failed' })
  }
})

// POST /posts/:id/report - report a post
router.post('/:id/report', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { reason } = req.body
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Check if user is trying to report their own post
    if (post.authorId.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot report your own post' })
    }

    // Here you would typically save the report to a database
    // For now, we'll just log it
    console.log(`Post ${req.params.id} reported by user ${req.userId}. Reason: ${reason}`)
    
    res.json({ message: 'Report submitted successfully' })
  } catch (error) {
    console.error('Report post failed:', error)
    res.status(500).json({ message: 'Report post failed' })
  }
})

export default router


