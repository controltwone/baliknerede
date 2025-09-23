import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

export interface AuthedRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization || ''
    const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null
    // Also accept HttpOnly cookie set at Auth0 completion
    // @ts-ignore
    const cookieToken = (req as any).cookies?.bn_token || null
    const token = headerToken || cookieToken
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const secret = process.env.JWT_SECRET || 'dev_secret'
    const payload = jwt.verify(token, secret) as { sub: string }
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}




