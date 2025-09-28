"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Post from '@/components/Post'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'

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

  const isOwnProfile = user?.id && userId && String(user.id) === String(userId)

  React.useEffect(() => {
    if (!userId) return
    
    let cancelled = false
    ;(async () => {
      try {
        const [ir, pr, fr, ngr] = await Promise.all([
          fetch(`${API_BASE}/users/${userId}`),
          fetch(`${API_BASE}/posts/by/${userId}`),
          fetch(`${API_BASE}/users/${userId}/followers`),
          fetch(`${API_BASE}/users/${userId}/following`),
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
      } catch {}
    })()
    return () => { cancelled = true }
  }, [API_BASE, userId])

  async function toggleFollow() {
    if (!userId || isOwnProfile) return
    if (isFollowing) {
      await fetch(`${API_BASE}/follow/${userId}`, { method: 'DELETE', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      setIsFollowing(false)
    } else {
      await fetch(`${API_BASE}/follow/${userId}`, { method: 'POST', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      setIsFollowing(true)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={info?.avatarUrl || "/logo.png"} alt={info?.name || 'Kullanıcı'} />
            <AvatarFallback>{(info?.name || 'K').slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{info?.name || 'Kullanıcı'}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <button
              className="rounded-md border px-2 py-1 hover:bg-accent"
              onClick={() => setShowListModal('followers')}
            >
              <span className="font-medium">Takipçi</span> {info?.followers || 0}
            </button>
            <button
              className="rounded-md border px-2 py-1 hover:bg-accent"
              onClick={() => setShowListModal('following')}
            >
              <span className="font-medium">Takip</span> {info?.following || 0}
            </button>
          </div>
          </div>
        </div>
        {userId && !isOwnProfile ? (
          <Button variant="outline" onClick={toggleFollow}>
            {isFollowing ? 'Takip' : 'Takip Et'}
          </Button>
        ) : null}
      </div>

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
            createdAt={new Date(p.createdAt).toLocaleString()}
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
    </div>
  )
}