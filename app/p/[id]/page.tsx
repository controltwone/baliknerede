"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Post from '@/components/Post'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/AuthProvider'
import { formatRelativeTime } from '@/lib/time'

export default function PostDetailPage() {
  const params = useParams() as { id: string }
  const id = params?.id
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const { token } = useAuth()

  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<any | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/posts/${id}`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Gönderi bulunamadı')
        const json = await res.json()
        if (!cancelled) setData(json.post)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Bir hata oluştu')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [API_BASE, id, token])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">Yükleniyor...</CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-sm text-red-600 dark:text-red-400">{error || 'Gönderi bulunamadı'}</CardContent>
        </Card>
      </div>
    )
  }

  const postProps = {
    id: data._id,
    authorId: data.authorId?._id,
    authorName: data.authorId?.name || 'Kullanıcı',
    authorAvatarUrl: data.authorId?.avatarUrl || '/logo.png',
    imageUrl: data.imageUrl,
    contentText: data.contentText,
    locationCity: data.locationCity,
    locationSpot: data.locationSpot,
    fishType: data.fishType,
    likeCount: data.likeCount || 0,
    commentCount: data.commentCount || 0,
    viewCount: data.viewCount || 0,
    createdAt: formatRelativeTime(data.createdAt),
    liked: !!data.liked,
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-2 sm:px-0 py-6">
      <Post {...postProps} />
    </div>
  )
}


