"use client"
import { useEffect, useState } from "react"
import { Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const [myPosts, setMyPosts] = useState<Array<{ _id: string; imageUrl?: string; contentText?: string; createdAt?: string; likeCount?: number; commentCount?: number }>>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalPost, setModalPost] = useState<{ _id: string; imageUrl?: string; contentText?: string } | null>(null)
  const [modalComments, setModalComments] = useState<Array<{ userId: string; userName?: string; text: string; createdAt: string }>>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login")
  }, [isAuthenticated, router])
  if (!isAuthenticated) return null

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/posts/my`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setMyPosts(data.posts || [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [API_BASE, token])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <section className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/logo.png" alt="avatar" />
            <AvatarFallback>{(user?.name || 'BN').slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{user?.name || 'Kullanıcı'}</h1>
            <p className="text-sm text-muted-foreground">Balık meraklısı • İstanbul</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Profili Düzenle</Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold">{myPosts.length}</div>
            <div className="text-muted-foreground">Gönderi</div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold">Gönderiler</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {myPosts.map((p) => (
              <button
                key={p._id}
                className="relative aspect-square overflow-hidden rounded-md border bg-muted text-left"
                onClick={async () => {
                  setShowModal(true)
                  setModalPost(p)
                  try {
                    setLoadingComments(true)
                    const res = await fetch(`${API_BASE}/posts/${p._id}/comments`)
                    if (res.ok) {
                      const data = await res.json()
                      setModalComments((data.comments || []).map((c: any) => ({
                        userId: String(c.userId), userName: c.userName, text: c.text, createdAt: new Date(c.createdAt).toLocaleString()
                      })))
                    }
                  } finally {
                    setLoadingComments(false)
                  }
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="post" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-3 text-center text-sm text-foreground bg-background">
                    <p className="line-clamp-6 whitespace-pre-wrap">{p.contentText || 'Görsel yok'}</p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-3 bg-black/40 px-2 py-1 text-[11px] text-white">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {p.likeCount ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {p.commentCount ?? 0}
                  </span>
                </div>
              </button>
            ))}
            {myPosts.length === 0 ? (
              <p className="col-span-full text-center text-sm text-muted-foreground">Henüz gönderin yok.</p>
            ) : null}
          </div>
        )}
      </section>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className={`relative z-10 w-full ${modalPost?.imageUrl ? 'max-w-2xl' : 'max-w-lg'} rounded-xl border bg-background p-4 shadow-lg max-h-[90vh] overflow-auto`}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Gönderi</h3>
              <Button variant="outline" onClick={() => setShowModal(false)}>Kapat</Button>
            </div>
            {modalPost?.imageUrl ? (
              <div className="relative mb-4 w-full overflow-hidden rounded-md border max-h-[60vh] flex items-center justify-center bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={modalPost.imageUrl} alt="post" className="max-h-[60vh] w-auto object-contain" />
              </div>
            ) : null}
            {modalPost?.contentText ? (
              <div className="mb-4 rounded-md border bg-muted/30 p-4 text-left">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{modalPost.contentText}</p>
              </div>
            ) : null}
            <div className="max-h-[40vh] overflow-auto">
              {loadingComments ? (
                <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
              ) : modalComments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Henüz yorum yok.</p>
              ) : (
                modalComments.map((c, i) => (
                  <div key={i} className="mb-2 rounded-md border p-2 text-sm last:mb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{c.userName || 'Kullanıcı'}</span>
                      <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProfilePostComments({ postId }: { postId: string }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const [list, setList] = useState<Array<{ userId: string; userName?: string; text: string; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/posts/${postId}/comments`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setList((data.comments || []).map((c: any) => ({
          userId: String(c.userId), userName: c.userName, text: c.text, createdAt: new Date(c.createdAt).toLocaleString()
        })))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [API_BASE, postId])
  if (loading) return <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
  if (list.length === 0) return <p className="text-sm text-muted-foreground">Henüz yorum yok.</p>
  return (
    <div className="space-y-2">
      {list.map((c, i) => (
        <div key={i} className="rounded-md border p-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">{c.userName || 'Kullanıcı'}</span>
            <span className="text-xs text-muted-foreground">{c.createdAt}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap">{c.text}</p>
        </div>
      ))}
    </div>
  )
}

