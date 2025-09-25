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
    <div className="bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-lg border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 flex items-center gap-3">
          <Image src="/logo.png" width={72} height={72} alt="BALIKNEREDE logo" />
          <span className="text-xl font-bold hidden sm:block" style={{color: '#158EC3'}}>baliknerede.com</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">Akış</Button>
          </Link>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300" placeholder="Ara: balık noktası, kullanıcı, etiket..." />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50">
            <Search className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
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

          {isAuthenticated && (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button as={Button} variant="ghost" className="px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || ''} />
                    <AvatarFallback>{user?.name?.slice(0,2).toUpperCase() || 'BN'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.name}</span>
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
          )}
          
          {!isAuthenticated && (
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                Giriş Yap
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header

