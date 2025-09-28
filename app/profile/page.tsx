"use client"
import React, { useEffect, useState } from "react"
import { Trash2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { formatRelativeTime } from "@/lib/time"
import Post from "@/components/Post"

export default function ProfilePage() {
  const { isAuthenticated, user, token, setUser } = useAuth()
  const router = useRouter()
  const [myPosts, setMyPosts] = useState<Array<{ _id: string; imageUrl?: string; contentText?: string; createdAt?: string; likeCount?: number; commentCount?: number }>>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [followersList, setFollowersList] = useState<Array<{ id: string; name: string }>>([])
  const [followingList, setFollowingList] = useState<Array<{ id: string; name: string }>>([])
  const [showListModal, setShowListModal] = useState<null | 'followers' | 'following'>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

  // Auth check effect - always runs
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  // Data loading effect - always runs
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const [pr, fr, ngr] = await Promise.all([
          fetch(`${API_BASE}/posts/my`, {
            credentials: 'include',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }),
          fetch(`${API_BASE}/users/${user.id}/followers`),
          fetch(`${API_BASE}/users/${user.id}/following`),
        ])
        if (pr.ok) {
          const data = await pr.json()
          if (!cancelled) setMyPosts(data.posts || [])
        }
        if (fr.ok) {
          const d = await fr.json()
          if (!cancelled) setFollowersList(d.followers || [])
        }
        if (ngr.ok) {
          const d = await ngr.json()
          if (!cancelled) setFollowingList(d.following || [])
        }
      } catch (error) {
        console.error('Profile data loading error:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [API_BASE, token, isAuthenticated, user?.id])

  if (!isAuthenticated) return null

  const handleEditProfile = () => {
    setEditName(user?.name || '')
    setEditBio(user?.bio || '')
    setSelectedFile(null)
    setPreviewUrl(null)
    setShowEditModal(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) return
    setIsUpdating(true)
    try {
      let finalAvatarUrl = user?.avatarUrl // Keep current avatar if no new file

      // If a file is selected, upload it first
      if (selectedFile) {
        // 1. Get presigned URL
        const presignRes = await fetch(`${API_BASE}/upload/presign`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({
            fileName: `avatar-${Date.now()}-${selectedFile.name}`,
            fileType: selectedFile.type
          })
        })
        
        if (!presignRes.ok) throw new Error("Presigned URL alınamadı")
        const { uploadUrl, publicUrl } = await presignRes.json()

        // 2. Upload file to R2
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': selectedFile.type },
          body: selectedFile
        })
        
        if (!uploadRes.ok) throw new Error("Dosya yüklenemedi")
        finalAvatarUrl = publicUrl
      }

      // 3. Update profile
      const res = await fetch(`${API_BASE}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editName.trim(),
          bio: editBio.trim() || undefined,
          avatarUrl: finalAvatarUrl
        })
      })
      if (res.ok) {
        const data = await res.json()
        // Update user in context
        setUser(data.user)
        setShowEditModal(false)
      }
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeletePost = (postId: string) => {
    setSelectedPostId(postId)
    setShowDeleteModal(true)
  }

  const confirmDeletePost = async () => {
    if (!selectedPostId || !token) return
    
    setIsDeleting(true)
    try {
      const res = await fetch(`${API_BASE}/posts/${selectedPostId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      })
      
      if (res.ok) {
        // Remove post from local state
        setMyPosts(prev => prev.filter(p => p._id !== selectedPostId))
        setShowDeleteModal(false)
        setSelectedPostId(null)
      } else {
        console.error('Failed to delete post')
      }
    } catch (error) {
      console.error('Delete post failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 page-content">
      <section className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatarUrl || "/logo.png"} alt={user?.name || 'Kullanıcı'} />
            <AvatarFallback>{(user?.name || 'K').slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{user?.name || 'Kullanıcı'}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <button
                className="rounded-md border px-2 py-1 hover:bg-accent"
                onClick={() => setShowListModal('followers')}
              >
                <span className="font-medium">Takipçi</span> {followersList.length}
              </button>
              <button
                className="rounded-md border px-2 py-1 hover:bg-accent"
                onClick={() => setShowListModal('following')}
              >
                <span className="font-medium">Takip</span> {followingList.length}
              </button>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={handleEditProfile}>
          Profili Düzenle
        </Button>
      </section>


      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <>
            {myPosts.map((p: any) => (
              <Post
                key={p._id}
                id={p._id}
                authorId={user?.id}
                authorName={user?.name || 'Kullanıcı'}
                authorAvatarUrl={user?.avatarUrl || "/logo.png"}
                imageUrl={p.imageUrl}
                contentText={p.contentText}
                likeCount={p.likeCount}
                commentCount={p.commentCount}
                createdAt={formatRelativeTime(p.createdAt)}
                locationCity={p.locationCity}
                locationSpot={p.locationSpot}
                viewCount={p.viewCount}
                onDelete={handleDeletePost}
              />
            ))}
            {myPosts.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">Henüz gönderi yok.</p>
            ) : null}
          </>
        )}
      </div>


      <Transition show={!!showListModal} as={React.Fragment}>
        <Dialog className="relative z-50" onClose={() => setShowListModal(null)}>
          <TransitionChild
            enter="transition-opacity ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="transition-all ease-out duration-150"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <DialogPanel className="w-full max-w-sm rounded-xl border bg-background p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold">{showListModal === 'followers' ? 'Takipçiler' : 'Takip Ettiklerim'}</h3>
                    <button className="text-sm text-muted-foreground" onClick={() => setShowListModal(null)}>Kapat</button>
                  </div>
                  <div className="max-h-96 space-y-2 overflow-auto">
                    {(showListModal === 'followers' ? followersList : followingList).length === 0 ? (
                      <p className="text-sm text-muted-foreground">Liste boş.</p>
                    ) : (
                      (showListModal === 'followers' ? followersList : followingList).map((u) => (
                        <Link key={u.id} href={`/u/${u.id}`} onClick={() => setShowListModal(null)} className="block rounded-md border p-2 hover:bg-accent">
                          {u.name}
                        </Link>
                      ))
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Profile Edit Modal */}
      <Transition show={showEditModal} as={React.Fragment}>
        <Dialog className="relative z-50" onClose={() => setShowEditModal(false)}>
          <TransitionChild
            enter="transition-opacity ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="transition-all ease-out duration-150"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <DialogPanel className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Profili Düzenle</h3>
                    <button className="text-sm text-muted-foreground" onClick={() => setShowEditModal(false)}>Kapat</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-md border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        placeholder="Kullanıcı adınızı girin"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Hakkımda</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full rounded-md border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        placeholder="Kendiniz hakkında bir şeyler yazın..."
                        rows={3}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{editBio.length}/500</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-5">Profil Fotoğrafı</label>
                      <div className="flex items-center gap-4">
                        <label htmlFor="avatarInput" className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-muted/40 hover:bg-muted cursor-pointer transition-colors">
                          {previewUrl || user?.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={(previewUrl as string) || (user?.avatarUrl as string)} alt="Avatar preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="mt-1 text-[11px] text-muted-foreground">Fotoğraf ekle</span>
                            </div>
                          )}
                        </label>
                        <div className="space-y-1">
                          <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <p className="text-xs text-muted-foreground">PNG, JPG veya JPEG. Maks. ~5MB.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setShowEditModal(false)}>
                        İptal
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isUpdating || !editName.trim()}>
                        {isUpdating ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={showDeleteModal}>
        <Dialog onClose={() => setShowDeleteModal(false)} className="relative z-50">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Gönderiyi Sil
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Bu işlem geri alınamaz
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-4"
                  >
                    İptal
                  </Button>
                  <Button
                    onClick={confirmDeletePost}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-4"
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Siliniyor...
                      </div>
                    ) : (
                      'Sil'
                    )}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}