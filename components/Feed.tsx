"use client"

import React, { useEffect, useState } from "react"
import Post from "@/components/Post"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "./AuthProvider"

type FeedPost = {
  id: string
  authorName: string
  authorAvatarUrl?: string
  imageUrl?: string
  contentText?: string
  likeCount?: number
  commentCount?: number
  createdAt?: string
}

export default function Feed() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const { user } = useAuth()

  const [contentText, setContentText] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [isPosting, setIsPosting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<FeedPost[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/posts`, { credentials: 'include' })
        if (!res.ok) throw new Error("Liste alınamadı")
        const data = await res.json()
        const mapped: FeedPost[] = (data.posts || []).map((p: any) => ({
          id: p._id,
          authorName: p.authorId?.name || "Kullanıcı",
          authorAvatarUrl: "/logo.png",
          imageUrl: p.imageUrl,
          contentText: p.contentText,
          likeCount: p.likeCount || 0,
          commentCount: p.commentCount || 0,
          createdAt: new Date(p.createdAt).toLocaleString(),
        }))
        if (!cancelled) setPosts(mapped)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Bir hata oluştu")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [API_BASE])

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleShare() {
    if (!contentText && !imageUrl) return
    setIsPosting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contentText, imageUrl }),
      })
      if (!res.ok) throw new Error("Gönderi paylaşılamadı (giriş gerekli olabilir)")
      const data = await res.json()
      const p = data.post
      const newPost: FeedPost = {
        id: p._id,
        authorName: user?.name || "Sen",
        authorAvatarUrl: "/logo.png",
        imageUrl: p.imageUrl,
        contentText: p.contentText,
        likeCount: p.likeCount || 0,
        commentCount: p.commentCount || 0,
        createdAt: new Date(p.createdAt).toLocaleString(),
      }
      setPosts((prev) => [newPost, ...prev])
      setContentText("")
      setImageUrl(undefined)
    } catch (e: any) {
      setError(e?.message || "Paylaşım sırasında hata")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Bir şeyler paylaş</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <textarea
            className="min-h-24 w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            placeholder="Bugün nerede, ne yakaladın?"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
          />
          <div className="flex items-center justify-between gap-3">
            <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
            <Button onClick={handleShare} disabled={isPosting || (!contentText && !imageUrl)}>
              {isPosting ? "Paylaşılıyor..." : "Paylaş"}
            </Button>
          </div>
          {imageUrl ? (
            <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
            </div>
          ) : null}
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((p) => (
            <Post key={p.id} {...p} />
          ))}
          {posts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Henüz gönderi yok.</p>
          ) : null}
        </div>
      )}
    </div>
  )
}


