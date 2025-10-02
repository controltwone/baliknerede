"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Post from '@/components/Post'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { UserPlus, X } from 'lucide-react'
import { formatRelativeTime } from '@/lib/time'

export default function UserProfilePage() {
  const params = useParams() as { id: string }
  const userId = params?.id
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const { isAuthenticated, token, user } = useAuth()
  
  const [info, setInfo] = React.useState<{ id: string; name: string; avatarUrl?: string; followers: number; following: number } | null>(null)
  const [posts, setPosts] = React.useState<any[]>([])
  const [isFollowing, setIsFollowing] = React.useState<boolean | null>(null)
  const [followersList, setFollowersList] = React.useState<{ id: string; name: string; avatarUrl?: string }[]>([])
  const [followingList, setFollowingList] = React.useState<{ id: string; name: string; avatarUrl?: string }[]>([])
  const [showListModal, setShowListModal] = React.useState<null | 'followers' | 'following'>(null)
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  const isOwnProfile = user?.id && userId && String(user.id) === String(userId)

  React.useEffect(() => {
    if (!userId) return
    
    let cancelled = false
    ;(async () => {
      try {
        const [ir, pr, fr, ngr, fsr] = await Promise.all([
          fetch(`${API_BASE}/users/${userId}`),
          fetch(`${API_BASE}/posts/by/${userId}`),
          fetch(`${API_BASE}/users/${userId}/followers`),
          fetch(`${API_BASE}/users/${userId}/following`),
          fetch(`${API_BASE}/users/${userId}/follow-status`, {
            credentials: 'include',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }),
        ])
        if (ir.ok) {
          const d = await ir.json()
          if (!cancelled) setInfo(d)
        }
        if (pr.ok) {
          const d = await pr.json()
          if (!cancelled) setPosts(d.posts || [])
        }
        if (fr.ok) {
          const d = await fr.json()
          console.log('Followers response:', d)
          if (!cancelled) setFollowersList(d.followers || [])
        } else {
          console.log('Followers request failed:', fr.status)
        }
        if (ngr.ok) {
          const d = await ngr.json()
          console.log('Following response:', d)
          if (!cancelled) setFollowingList(d.following || [])
        } else {
          console.log('Following request failed:', ngr.status)
        }
        if (fsr.ok) {
          const d = await fsr.json()
          if (!cancelled) setIsFollowing(d.isFollowing || false)
        }
      } catch {}
    })()
    return () => { cancelled = true }
  }, [API_BASE, userId, isAuthenticated])

  async function toggleFollow() {
    if (!userId || isOwnProfile) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    if (isFollowing) {
      await fetch(`${API_BASE}/follow/${userId}`, { method: 'DELETE', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      setIsFollowing(false)
    } else {
      await fetch(`${API_BASE}/follow/${userId}`, { method: 'POST', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      setIsFollowing(true)
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl flex-col gap-8 px-2 sm:px-0 page-content pb-24">
      <section className="mb-8 mt-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                <AvatarImage src={info?.avatarUrl || "/logo.png"} alt={info?.name || 'Kullanıcı'} />
                <AvatarFallback className="text-lg font-bold">{(info?.name || 'K').slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {info?.name || 'Kullanıcı'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Balıkçı
                  </p>
                </div>
                
                {userId && !isOwnProfile ? (
                  <div className="flex items-center gap-3">
                    {isFollowing && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Takip Ediliyor
                      </span>
                    )}
                    <Button 
                      variant={isFollowing ? "destructive" : "outline"} 
                      onClick={toggleFollow}
                      className={isFollowing ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-700 dark:hover:border-red-600" : ""}
                    >
                      {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                    </Button>
                  </div>
                ) : null}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowListModal('followers')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-700/60 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{info?.followers || 0}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Takipçi</span>
                </button>
                <button
                  onClick={() => setShowListModal('following')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-700/60 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{info?.following || 0}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Takip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6">
        {posts.map((p: any) => (
          <Post
            key={p._id}
            id={p._id}
            authorId={p.authorId}
            authorName={info?.name || 'Kullanıcı'}
            authorAvatarUrl={info?.avatarUrl || "/logo.png"}
            imageUrl={p.imageUrl}
            contentText={p.contentText}
            likeCount={p.likeCount}
            commentCount={p.commentCount}
            createdAt={formatRelativeTime(p.createdAt)}
          />
        ))}
        {posts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Henüz gönderi yok.</p>
        ) : null}
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
                    <h3 className="text-base font-semibold">
                      {showListModal === 'followers' ? 'Takipçiler' : 'Takip Ettikleri'}
                    </h3>
                    <button className="text-sm text-muted-foreground" onClick={() => setShowListModal(null)}>Kapat</button>
                  </div>
                  <div className="max-h-96 space-y-2 overflow-auto">
                    {(showListModal === 'followers' ? followersList : followingList).length === 0 ? (
                      <p className="text-sm text-muted-foreground">Liste boş.</p>
                    ) : (
                      (showListModal === 'followers' ? followersList : followingList).map((u) => (
                        <Link key={u.id} href={`/u/${u.id}`} onClick={() => setShowListModal(null)} className="block rounded-md border p-2 hover:bg-accent">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatarUrl || "/logo.png"} alt={u.name} />
                              <AvatarFallback>{u.name.slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{u.name}</span>
                          </div>
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

      {/* Auth Required Modal */}
      <Transition show={showAuthModal} as={React.Fragment}>
        <Dialog className="relative z-50" onClose={() => setShowAuthModal(false)}>
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
                <DialogPanel className="w-full max-w-md rounded-2xl border bg-white dark:bg-gray-800 p-6 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Giriş Gerekli
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Takip etmek için hesabınıza giriş yapmalısınız
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAuthModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Kullanıcıları takip edebilmek, gönderilerini beğenmek ve yorum yapabilmek için giriş yapmanız gerekiyor.
                  </p>

                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowAuthModal(false)}
                      className="px-4"
                    >
                      İptal
                    </Button>
                    <Link href="/login">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                        Giriş Yap
                      </Button>
                    </Link>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}