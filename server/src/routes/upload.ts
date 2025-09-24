import express = require('express')
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { AuthedRequest, requireAuth } from '../middleware/auth'

const router = express.Router()

// Support Cloudflare R2 (S3-compatible) via custom endpoint
const s3 = new S3Client({
  region: process.env.R2_REGION || process.env.AWS_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT || undefined,
  forcePathStyle: !!process.env.R2_ENDPOINT, // R2 genelde path-style ister
  credentials: (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) ? {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  } : (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  } : undefined,
})

router.post('/presign', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { fileName, fileType } = req.body || {}
    if (!fileName || !fileType) return res.status(400).json({ message: 'fileName and fileType required' })
    const bucket = (process.env.R2_BUCKET || process.env.S3_BUCKET) as string
    if (!bucket) return res.status(500).json({ message: 'Bucket not configured' })
    const key = `uploads/${req.userId}/${Date.now()}-${fileName}`
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: fileType })
    const url = await getSignedUrl(s3, command, { expiresIn: 60 })
    // Prefer R2 public base if provided, else build standard R2 hostname
    const publicBase = process.env.R2_PUBLIC_BASE || (process.env.R2_ACCOUNT_ID ? `https://${bucket}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined)
    const publicUrl = publicBase ? `${publicBase}/${key}` : `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    return res.json({ uploadUrl: url, publicUrl })
  } catch (e) {
    console.error('presign error', e)
    return res.status(500).json({ message: 'presign failed' })
  }
})

export default router



