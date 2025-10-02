import express = require('express')
import { auth } from 'express-openid-connect'
import jwt = require('jsonwebtoken')
const UserModule = require('../models/User')
const User = (UserModule && (UserModule.default || UserModule)) as any

const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+"

const router = express.Router()

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:4000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  // Auth0 callback: baseURL + '/callback' → bu yolu lib kendi yönetir
  routes: { callback: '/callback' },
}

router.use(auth(config as any))

router.get('/auth0/login', (req: any, res) => {
  // Başarılı dönüşte app tarafına tamamla endpointine yönlendir
  // Google'a direkt yönlendirmek için connection ve prompt parametreleri gönder
  res.oidc.login({
    returnTo: '/auth0/complete',
    authorizationParams: {
      // Auth0 Google Social Connection identifier
      connection: 'google-oauth2',
      // Her seferinde hesap seçim ekranını göster
      prompt: 'select_account',
    },
  })
})

// Callback'ı express-openid-connect handle eder; biz tamamlamayı ayrı endpointte yapıyoruz
router.get('/auth0/complete', async (req: any, res) => {
  try {
    const claims = req.oidc.user
    if (!claims) return res.redirect('/auth0/login')
    const email = claims.email
    const name = claims.name || (email ? email.split('@')[0] : 'User')
    let user = await User.findOne({ email })
    if (!user) user = await User.create({ name, email, password: jwt.sign({ t: Date.now() }, 'x'), avatarUrl: DEFAULT_AVATAR })
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.cookie('bn_token', token, {
      httpOnly: true,
      secure: true, // localhost kabul edilir; cross-site cookie için gerekli
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  } catch (e) {
    console.error('Auth0 complete error:', e)
    return res.redirect('/')
  }
})

router.get('/auth0/logout', (req: any, res) => {
  try {
    // Clear all possible cookies
    res.clearCookie('bn_token')
    res.clearCookie('appSession')
    res.clearCookie('connect.sid')
    // Clear any other Auth0 related cookies
    const cookies = req.headers.cookie
    if (cookies) {
      cookies.split(';').forEach((cookie: string) => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        if (name) {
          res.clearCookie(name, { path: '/' })
          res.clearCookie(name, { path: '/', domain: process.env.AUTH0_DOMAIN })
        }
      })
    }
  } catch (error) {
    console.error('Error clearing cookies:', error)
  }
  // Auth0 oturumu da kapat ve frontend'e dön
  return res.oidc.logout({ returnTo: process.env.CLIENT_ORIGIN || 'http://localhost:3000' })
})

// Frontend'in header kullanabilmesi için cookieden token'ı geri ver (dev amaçlı)
router.get('/auth0/token', (req: any, res) => {
  const token = req.cookies?.bn_token
  if (!token) return res.status(401).json({ message: 'No session' })
  return res.json({ token })
})

export default router


