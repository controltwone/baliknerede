"use client"

import React, { useEffect, useState } from "react"
import { formatRelativeTime } from "../lib/time"
import Post from "@/components/Post"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "./AuthProvider"
import { useLocationFilter } from "./LocationFilterProvider"

type FeedPost = {
  id: string
  authorId?: string
  authorName: string
  authorAvatarUrl?: string
  imageUrl?: string
  contentText?: string
  locationCity?: string
  locationSpot?: string
  likeCount?: number
  commentCount?: number
  createdAt?: string
  liked?: boolean
}

export default function Feed() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const { user, token } = useAuth()
  const { selectedLocation } = useLocationFilter()

  const [contentText, setContentText] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [locationCity, setLocationCity] = useState<string>("İstanbul")
  const [locationSpot, setLocationSpot] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<FeedPost[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/posts`, { 
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        })
        if (!res.ok) throw new Error("Liste alınamadı")
        const data = await res.json()
        const mapped: FeedPost[] = (data.posts || []).map((p: any) => ({
          id: p._id,
          authorId: p.authorId?._id || undefined,
          authorName: p.authorId?.name || "Kullanıcı",
          authorAvatarUrl: p.authorId?.avatarUrl || "/logo.png",
          imageUrl: p.imageUrl,
          contentText: p.contentText,
          locationCity: p.locationCity,
          locationSpot: p.locationSpot,
          likeCount: p.likeCount || 0,
          commentCount: p.commentCount || 0,
          createdAt: formatRelativeTime(p.createdAt),
          liked: p.liked || false,
        }))
        if (!cancelled) {
          // Filter posts by selected location if any
          const filtered = selectedLocation 
            ? mapped.filter(p => p.locationSpot === selectedLocation)
            : mapped
          setPosts(filtered)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Bir hata oluştu")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [API_BASE, selectedLocation])

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    // Preview için base64 kullan, yükleme sırasında R2'ye yükle
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleShare() {
    if (!contentText && !selectedFile) return
    setIsPosting(true)
    setError(null)
    try {
      let finalImageUrl: string | undefined = undefined

      // Eğer dosya seçilmişse R2'ye yükle
      if (selectedFile) {
        // 1. Presigned URL al
        const presignRes = await fetch(`${API_BASE}/upload/presign`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileType: selectedFile.type
          })
        })
        
        if (!presignRes.ok) throw new Error("Presigned URL alınamadı")
        const { uploadUrl, publicUrl } = await presignRes.json()

        // 2. Dosyayı R2'ye yükle
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': selectedFile.type },
          body: selectedFile
        })
        
        if (!uploadRes.ok) throw new Error("Dosya yüklenemedi")
        finalImageUrl = publicUrl
      }

      // 3. Gönderiyi oluştur
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ contentText, imageUrl: finalImageUrl, locationCity, locationSpot }),
      })
      if (!res.ok) throw new Error("Gönderi paylaşılamadı (giriş gerekli olabilir)")
      const data = await res.json()
      const p = data.post
      const newPost: FeedPost = {
        id: p._id,
        authorName: user?.name || "Sen",
        authorAvatarUrl: user?.avatarUrl || "/logo.png",
        imageUrl: p.imageUrl,
        contentText: p.contentText,
        locationCity: p.locationCity,
        locationSpot: p.locationSpot,
        likeCount: p.likeCount || 0,
        commentCount: p.commentCount || 0,
        createdAt: formatRelativeTime(p.createdAt),
      }
      setPosts((prev) => [newPost, ...prev])
      setContentText("")
      setImageUrl(undefined)
      setSelectedFile(null)
    } catch (e: any) {
      setError(e?.message || "Paylaşım sırasında hata")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-2 sm:px-0">
      <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white/90 to-blue-50/40 dark:from-gray-800/90 dark:to-gray-700/40 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            {user ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                <img 
                  src={user.avatarUrl || "/logo.png"} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10"></div>
            )}
            <div className="flex-1 space-y-4 min-w-0">
              <textarea
                className="w-full min-h-20 resize-none border-0 bg-transparent text-sm sm:text-base placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-white focus:outline-none focus:ring-0"
                placeholder="Bugün nerede, ne yakaladın? 🎣"
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
              />
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 justify-center sm:justify-start">
                    <select
                      className="rounded-md border bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white px-1 py-1 text-xs sm:text-sm flex-1 max-w-[100px] sm:max-w-none"
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                    >
                      <option>İstanbul</option>
                    </select>
                    <select
                      className="rounded-md border bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white px-1 py-1 text-xs sm:text-sm flex-1 max-w-[100px] sm:max-w-none"
                      value={locationSpot}
                      onChange={(e) => setLocationSpot(e.target.value)}
                    >
                      <option value="">Konum seç</option>
                      <option value="Galata Köprüsü">Galata Köprüsü</option>
                      <option value="Unkapanı Köprüsü">Unkapanı Köprüsü</option>
                      <option value="Sarayburnu">Sarayburnu</option>
                      <option value="Karaköy">Karaköy</option>
                      <option value="Kadıköy Rıhtım">Kadıköy Rıhtım</option>
                      <option value="Akıntıburnu">Akıntıburnu</option>
                      <option value="Arnavutköy">Arnavutköy</option>
                      <option value="Kireçburnu-Yeniköy">Kireçburnu-Yeniköy</option>
                      <option value="Dragos Sahili">Dragos Sahili</option>
                      <option value="Tuzla-Güzelyalı Sahili">Tuzla-Güzelyalı Sahili</option>
                      <option value="Anadolu Kavağı">Anadolu Kavağı</option>
                      <option value="Avcılar">Avcılar</option>
                      <option value="Beylerbeyi">Beylerbeyi</option>
                      <option value="Kuleli Askeri Lisesi">Kuleli Askeri Lisesi</option>
                      <option value="Tarabya">Tarabya</option>
                      <option value="Eyüp Sahil">Eyüp Sahil</option>
                      <option value="Haliç">Haliç</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">Fotoğraf</span>
                      <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <Button 
                      onClick={handleShare} 
                      disabled={isPosting || (!contentText && !selectedFile)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isPosting ? "Paylaşılıyor..." : "Paylaş"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {imageUrl ? (
            <div className="mt-4">
              <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="preview" className="w-full h-auto object-cover" />
                <button 
                  onClick={() => {
                    setImageUrl(undefined)
                    setSelectedFile(null)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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


