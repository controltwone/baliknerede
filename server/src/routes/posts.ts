import express = require('express')
const PostModule = require('../models/Post')
const Post = (PostModule && (PostModule.default || PostModule)) as any
import { AuthedRequest, requireAuth } from '../middleware/auth'

const router = express.Router()

// GET /posts - list latest posts
router.get('/', async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(50)
  res.json({ posts })
})

// POST /posts - create post (auth)
router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const { contentText, imageUrl } = req.body || {}
  const doc = await Post.create({
    authorId: req.userId,
    contentText,
    imageUrl,
  })
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

export default router


