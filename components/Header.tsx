"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bell, Search, Menu as MenuIcon, X, User, LogOut, Settings } from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAuth } from './AuthProvider'
import { useLocationFilter } from './LocationFilterProvider'
import { useTheme } from './ThemeProvider'
import React from 'react'
import { formatRelativeTime } from '../lib/time'
import { Sun, Moon, Shield } from 'lucide-react'
import { CustomSelect } from './ui/custom-select'

function Header() {
  const { isAuthenticated, user, logout, token } = useAuth()
  const { selectedLocation, setSelectedLocation, selectedFishType, setSelectedFishType } = useLocationFilter()
  const { theme, toggleTheme } = useTheme()

  const locationOptions = [
    { value: "", label: "Tüm Konumlar" },
    { value: "Galata Köprüsü", label: "Galata Köprüsü" },
    { value: "Unkapanı Köprüsü", label: "Unkapanı Köprüsü" },
    { value: "Sarayburnu", label: "Sarayburnu" },
    { value: "Karaköy", label: "Karaköy" },
    { value: "Kadıköy Rıhtım", label: "Kadıköy Rıhtım" },
    { value: "Akıntıburnu", label: "Akıntıburnu" },
    { value: "Arnavutköy", label: "Arnavutköy" },
    { value: "Kireçburnu-Yeniköy", label: "Kireçburnu-Yeniköy" },
    { value: "Dragos Sahili", label: "Dragos Sahili" },
    { value: "Tuzla-Güzelyalı Sahili", label: "Tuzla-Güzelyalı Sahili" },
    { value: "Anadolu Kavağı", label: "Anadolu Kavağı" },
    { value: "Avcılar", label: "Avcılar" },
    { value: "Beylerbeyi", label: "Beylerbeyi" },
    { value: "Kuleli Askeri Lisesi", label: "Kuleli Askeri Lisesi" },
    { value: "Tarabya", label: "Tarabya" },
    { value: "Eyüp Sahil", label: "Eyüp Sahil" },
    { value: "Haliç", label: "Haliç" },
    { value: "Florya Sahil", label: "Florya Sahil" },
    { value: "Yeşilköy Sahil", label: "Yeşilköy Sahil" },
    { value: "Bakırköy Sahil", label: "Bakırköy Sahil" },
    { value: "Yenikapı", label: "Yenikapı" }
  ]
  const fishOptions = [
    { value: "", label: "Tüm Balıklar" },
    { value: "İstavrit", label: "İstavrit" },
    { value: "Lüfer", label: "Lüfer" },
    { value: "Çinekop", label: "Çinekop" },
    { value: "Palamut", label: "Palamut" },
    { value: "Sardalya", label: "Sardalya" },
    { value: "Mezgit", label: "Mezgit" },
    { value: "Kefal", label: "Kefal" },
    { value: "Levrek", label: "Levrek" },
    { value: "Sinarit", label: "Sinarit" },
  ]
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<Array<{id: string, name: string, avatarUrl?: string}>>([])
  const [showSearchResults, setShowSearchResults] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Array<{ id: string; type: string; actorName: string; postId?: string; createdAt: string; read: boolean }>>([])
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  // User search function
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users || [])
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error('User search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

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
    <div className="bg-gradient-to-r from-white/80 to-blue-50/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-md sticky top-0 z-40 shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 flex items-center gap-3 group" onClick={() => setSelectedLocation("")}>
          <Image 
            src="/logo.png" 
            width={72} 
            height={72} 
            alt="BALIKNEREDE logo" 
            className="logo-float logo-hover-spin transition-all duration-300 group-hover:scale-110" 
          />
          <span 
            className="text-xl font-bold hidden sm:block transition-all duration-300 group-hover:scale-105 tracking-wide"
            style={{
              color: '#158EC3',
              fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
              textShadow: '0 2px 8px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(21, 142, 195, 0.3)',
              letterSpacing: '0.5px'
            }}
          >
            baliknerede.com
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 ml-20">
          <Link href="/" onClick={() => setSelectedLocation("")}>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200">Akış</Button>
          </Link>
          <div className="flex items-center gap-2 w-full">
            <CustomSelect
              options={locationOptions}
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Tüm Konumlar"
              className="min-w-[120px]"
              showIcon={true}
              searchPlaceholder="Konum ara..."
              notFoundText="Konum bulunamadı"
            />
            <CustomSelect
              options={fishOptions}
              value={selectedFishType}
              onChange={setSelectedFishType}
              placeholder="Tüm Balıklar"
              className="min-w-[120px]"
              showIcon={true}
              searchPlaceholder="Balık ara..."
              notFoundText="Balık bulunamadı"
            />
            <div className="relative flex-1 search-float">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
              <Input 
                className="pl-9 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 focus:bg-white/80 dark:focus:bg-gray-700/80 focus:border-blue-300 dark:focus:border-blue-500 dark:text-white transition-all duration-300 search-glow hover:shadow-lg hover:shadow-blue-500/20" 
                placeholder="Ara: kullanıcı, etiket..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Aranıyor...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <Link key={user.id} href={`/u/${user.id}`}>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl || "/logo.png"} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                      </Link>
                    ))
                  ) : searchQuery ? (
                    <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      Kullanıcı bulunamadı
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          {user?.isAdmin && (
            <Link href="/admin">
              <Button variant="outline" className="text-gray-700 hover:text-red-600 hover:bg-red-50/80 border-gray-300/50 hover:border-red-300 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-gray-700/80 dark:border-gray-600/50 dark:hover:border-red-500 backdrop-blur-sm transition-all duration-200">
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200"
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
              <Menu.Button as={Button} variant="ghost" className="px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 overflow-hidden rounded-full">
                    <AvatarImage className="object-cover" src={user?.avatarUrl || ''} alt={user?.name || ''} />
                    <AvatarFallback>{user?.name?.slice(0,2).toUpperCase() || 'BN'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
              </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 shadow-xl focus:outline-none overflow-hidden">
              {isAuthenticated ? (
                <>
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage className="object-cover" src={user?.avatarUrl || ''} alt={user?.name || ''} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          {user?.name?.slice(0,2).toUpperCase() || 'BN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Balık Meraklısı</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${active ? 'bg-blue-50 dark:bg-blue-900/20' : ''} flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200`}
                        >
                          <User className="h-4 w-4" />
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
                          className={`${active ? 'bg-red-50 dark:bg-red-900/20' : ''} flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 w-full text-left`}
                        >
                          <LogOut className="h-4 w-4" />
                          Çıkış Yap
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </>
              ) : (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/login"
                        className={`${active ? 'bg-blue-50 dark:bg-blue-900/20' : ''} flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200`}
                      >
                        <User className="h-4 w-4" />
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
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200">
                Giriş Yap
              </Button>
            </Link>
          )}
          
          {/* Blog Button */}
          <Link href="/blog">
            <Button variant="outline" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 border-gray-300/50 hover:border-blue-300 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 dark:border-gray-600/50 dark:hover:border-blue-500 backdrop-blur-sm transition-all duration-200 ml-10">Blog</Button>
          </Link>
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
              {user?.isAdmin && (
                <Link href="/admin" onClick={() => setShowMobileMenu(false)}>
                  <Button variant="outline" className="text-gray-700 hover:text-red-600 hover:bg-red-50 border-gray-300 hover:border-red-300 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-red-500 w-full">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>
            <div className="space-y-2">
              <CustomSelect
                options={locationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="Tüm Konumlar"
                className="w-full"
                showIcon={true}
                iconLabel="Konum Filtresi"
                searchPlaceholder="Konum ara..."
                notFoundText="Konum bulunamadı"
              />
              <CustomSelect
                options={fishOptions}
                value={selectedFishType}
                onChange={setSelectedFishType}
                placeholder="Tüm Balıklar"
                className="w-full"
                showIcon={true}
                iconLabel="Balık Filtresi"
                searchPlaceholder="Balık ara..."
                notFoundText="Balık bulunamadı"
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input 
                  className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-300 dark:focus:border-blue-500 dark:text-white" 
                  placeholder="Ara: kullanıcı, etiket..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
                
                {/* Mobile Search Results */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Aranıyor...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <Link key={user.id} href={`/u/${user.id}`} onClick={() => setShowMobileMenu(false)}>
                          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatarUrl || "/logo.png"} alt={user.name} />
                              <AvatarFallback>{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                          </div>
                        </Link>
                      ))
                    ) : searchQuery ? (
                      <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        Kullanıcı bulunamadı
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header

