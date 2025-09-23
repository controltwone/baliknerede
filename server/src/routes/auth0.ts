import express = require('express')
import { auth } from 'express-openid-connect'
import jwt = require('jsonwebtoken')
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any

const router = express.Router()

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:4000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
}

router.use(auth(config as any))

router.get('/auth0/login', (req: any, res) => {
  res.oidc.login({ returnTo: '/auth0/callback' })
})

router.get('/auth0/callback', async (req: any, res) => {
  try {
    const claims = req.oidc.user
    if (!claims) return res.redirect('/')
    const email = claims.email
    const name = claims.name || (email ? email.split('@')[0] : 'User')
    let user = await User.findOne({ email })
    if (!user) user = await User.create({ name, email, password: jwt.sign({ t: Date.now() }, 'x') })
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.cookie('bn_token', token, {
      httpOnly: true,
      secure: false, // prod: true
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  } catch (e) {
    console.error('Auth0 callback error:', e)
    return res.redirect('/')
  }
})

export default router


