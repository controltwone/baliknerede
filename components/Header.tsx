"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bell, Search, Menu as MenuIcon, X } from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAuth } from './AuthProvider'
import { useLocationFilter } from './LocationFilterProvider'
import { useTheme } from './ThemeProvider'
import React from 'react'
import { formatRelativeTime } from '../lib/time'
import { Sun, Moon } from 'lucide-react'

function Header() {
  const { isAuthenticated, user, logout, token } = useAuth()
  const { selectedLocation, setSelectedLocation } = useLocationFilter()
  const { theme, toggleTheme } = useTheme()
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Array<{ id: string; type: string; actorName: string; postId?: string; createdAt: string; read: boolean }>>([])
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

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
          createdAt: formatRelativeTime(n.createdAt),
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
    <div className="bg-gradient-to-r from-white/95 to-blue-50/80 dark:from-gray-900/95 dark:to-gray-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 flex items-center gap-3" onClick={() => setSelectedLocation("")}>
          <Image src="/logo.png" width={72} height={72} alt="BALIKNEREDE logo" />
          <span className="text-xl font-bold hidden sm:block" style={{color: '#158EC3'}}>baliknerede.com</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
          <Link href="/" onClick={() => setSelectedLocation("")}>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700">Akış</Button>
          </Link>
          <div className="flex items-center gap-2 w-full">
            <select
              className="rounded-md border bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white px-2 py-1.5 text-sm min-w-[100px]"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Tüm Konumlar</option>
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-300 dark:focus:border-blue-500 dark:text-white" placeholder="Ara: kullanıcı, etiket..." />
            </div>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-300 hover:border-blue-300 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-500">Blog</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700"
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
              <div className="absolute right-0 mt-2 w-80 rounded-md border bg-popover dark:bg-gray-800 dark:border-gray-600 p-2 shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-white">Bildirimler</span>
                  <button className="text-xs text-muted-foreground dark:text-gray-400" onClick={() => setShowNotifications(false)}>Kapat</button>
                </div>
                <div className="max-h-80 space-y-2 overflow-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-muted-foreground dark:text-gray-400">Bildirim yok.</p>
                  ) : notifications.map((n) => (
                    <div key={n.id} className="rounded-sm border dark:border-gray-600 p-2 text-sm dark:bg-gray-700">
                      <p className="dark:text-white">
                        <span className="font-medium">{n.actorName}</span>{' '}
                        {n.type === 'new_post' ? 'yeni bir gönderi paylaştı.' : n.type === 'follow' ? 'seni takip etti.' : n.type === 'like' ? 'gönderini beğendi.' : 'gönderine yorum yaptı.'}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground dark:text-gray-400">{n.createdAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {isAuthenticated && (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button as={Button} variant="ghost" className="px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 overflow-hidden rounded-full">
                    <AvatarImage className="object-cover" src={user?.avatarUrl || ''} alt={user?.name || ''} />
                    <AvatarFallback>{user?.name?.slice(0,2).toUpperCase() || 'BN'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
              </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border bg-popover dark:bg-gray-800 dark:border-gray-600 p-1 shadow-md focus:outline-none">
              {isAuthenticated ? (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${active ? 'bg-accent dark:bg-gray-700' : ''} block rounded-sm px-3 py-2 dark:text-white`}
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
                        className={`${active ? 'bg-accent dark:bg-gray-700' : ''} block w-full rounded-sm px-3 py-2 text-left dark:text-white`}
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
                        className={`${active ? 'bg-accent dark:bg-gray-700' : ''} block rounded-sm px-3 py-2 dark:text-white`}
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
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700">
                Giriş Yap
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white/95 to-blue-50/80 dark:from-gray-900/95 dark:to-gray-800/80 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-3">
            <div className="flex gap-2">
              <Link href="/" onClick={() => { setSelectedLocation(""); setShowMobileMenu(false); }}>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 w-full">Akış</Button>
              </Link>
              <Link href="/blog" onClick={() => setShowMobileMenu(false)}>
                <Button variant="outline" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-300 hover:border-blue-300 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-500 w-full">Blog</Button>
              </Link>
            </div>
            <div className="space-y-2">
              <select
                className="w-full rounded-md border bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white px-2 py-1.5 text-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Tüm Konumlar</option>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-300 dark:focus:border-blue-500 dark:text-white" placeholder="Ara: kullanıcı, etiket..." />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header

