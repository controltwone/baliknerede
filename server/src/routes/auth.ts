import express = require('express')
import jwt = require('jsonwebtoken')
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any

const router = express.Router()

function signToken(userId: string) {
  const secret = process.env.JWT_SECRET || 'dev_secret'
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' })
}

router.post('/signup', async (req, res) => {
  // const name = req.body.name
  // const email = req.body.email
  // const password = req.body.password

  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already in use' })
    const user = await User.create({ name, email, password })
    const token = signToken(user.id)
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (e) {
    console.error('Signup error:', e)
    // @ts-ignore
    if (e && e.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' })
    }
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await user.comparePassword(password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken(user.id)
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (e) {
    console.error('Login error:', e)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router


