"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bell, Search } from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAuth } from './AuthProvider'
import React from 'react'

function Header() {
  const { isAuthenticated, user, logout, token } = useAuth()
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Array<{ id: string; type: string; actorName: string; postId?: string; createdAt: string; read: boolean }>>([])

  React.useEffect(() => {
    let timer: any
    async function load() {
      if (!isAuthenticated) { setUnreadCount(0); return }
      try {
        const res = await fetch(`${API_BASE}/notifications/unread-count`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.count || 0)
        }
      } catch {}
    }
    load()
    timer = setInterval(load, 30000)
    return () => { if (timer) clearInterval(timer) }
  }, [API_BASE, isAuthenticated, token])

  async function openNotifications() {
    if (!isAuthenticated) return
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (res.ok) {
        const data = await res.json()
        const list = (data.notifications || []).map((n: any) => ({
          id: n.id,
          type: n.type,
          actorName: n.actorName,
          postId: n.postId,
          createdAt: new Date(n.createdAt).toLocaleString(),
          read: !!n.read,
        }))
        setNotifications(list)
      }
      // mark all as read
      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setUnreadCount(0)
    } catch {}
  }
  return (
    <div className="bg-amber-300 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" width={32} height={32} alt="fishing logo" />
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
          <Link href="/">
            <Button>Akış</Button>
          </Link>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Ara: balık noktası, kullanıcı, etiket..." />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              onClick={async () => {
                const next = !showNotifications
                setShowNotifications(next)
                if (next) await openNotifications()
              }}
            >
              <Bell className="h-5 w-5" />
              {isAuthenticated && unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </Button>
            {showNotifications ? (
              <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover p-2 shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Bildirimler</span>
                  <button className="text-xs text-muted-foreground" onClick={() => setShowNotifications(false)}>Kapat</button>
                </div>
                <div className="max-h-80 space-y-2 overflow-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Bildirim yok.</p>
                  ) : notifications.map((n) => (
                    <div key={n.id} className="rounded-sm border p-2 text-sm">
                      <p>
                        <span className="font-medium">{n.actorName}</span>{' '}
                        {n.type === 'new_post' ? 'yeni bir gönderi paylaştı.' : n.type === 'follow' ? 'seni takip etti.' : n.type === 'like' ? 'gönderini beğendi.' : 'gönderine yorum yaptı.'}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.createdAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button as={Button} variant="secondary" className="px-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || ''} />
                  <AvatarFallback>{(user?.name || 'BN').slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{isAuthenticated ? user?.name : 'Hesabım'}</span>
              </div>
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border bg-popover p-1 shadow-md focus:outline-none">
              {isAuthenticated ? (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${active ? 'bg-accent' : ''} block rounded-sm px-3 py-2`}
                      >
                        Profil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          logout()
                          window.location.href = `${API_BASE}/auth0/logout`
                        }}
                        className={`${active ? 'bg-accent' : ''} block w-full rounded-sm px-3 py-2 text-left`}
                      >
                        Çıkış Yap
                      </button>
                    )}
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/login"
                        className={`${active ? 'bg-accent' : ''} block rounded-sm px-3 py-2`}
                      >
                        Giriş Yap
                      </Link>
                    )}
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default Header

