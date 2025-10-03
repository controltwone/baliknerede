"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bell, Search, Menu as MenuIcon, X, User, LogOut, Settings, Heart, MessageCircle, UserPlus } from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAuth } from './AuthProvider'
import { useLocationFilter } from './LocationFilterProvider'
import { useTheme } from './ThemeProvider'
import React from 'react'
import { formatRelativeTime } from '../lib/time'
import { Sun, Moon, Shield } from 'lucide-react'
import { CustomSelect } from './ui/custom-select'
import { DEFAULT_AVATAR } from '../lib/constants'

function Header() {
  const { isAuthenticated, user, logout, token } = useAuth()
  const { selectedLocation, setSelectedLocation, selectedFishType, setSelectedFishType } = useLocationFilter()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    { value: "Yenikapı", label: "Yenikapı" },
    { value: "Büyükçekmece", label: "Büyükçekmece" },
    { value: "Tekirdağ Kıyıları", label: "Tekirdağ Kıyıları" },
    { value: "Marmara Ereğlisi", label: "Marmara Ereğlisi" },
    // Çanakkale
    { value: "Bozcaada Kıyıları (Çanakkale)", label: "Bozcaada Kıyıları (Çanakkale)" },
    { value: "Babakale (Çanakkale)", label: "Babakale (Çanakkale)" },
    { value: "Saros Körfezi (Çanakkale)", label: "Saros Körfezi (Çanakkale)" },
    { value: "Gelibolu Yarımadası (Çanakkale)", label: "Gelibolu Yarımadası (Çanakkale)" },
    { value: "Eceabat kıyıları (Çanakkale)", label: "Eceabat kıyıları (Çanakkale)" },
    { value: "Çardak Sahili (Lapseki çevresi) (Çanakkale)", label: "Çardak Sahili (Lapseki çevresi) (Çanakkale)" },
    { value: "Assos – Ayvacık kıyıları (Çanakkale)", label: "Assos – Ayvacık kıyıları (Çanakkale)" },
    // İzmir
    { value: "Çeşme (İzmir)", label: "Çeşme (İzmir)" },
    { value: "Mordoğan (İzmir)", label: "Mordoğan (İzmir)" },
    { value: "Aliağa (İzmir)", label: "Aliağa (İzmir)" },
    { value: "Dikili (İzmir)", label: "Dikili (İzmir)" },
    { value: "Bademli (İzmir)", label: "Bademli (İzmir)" },
    { value: "Güzelbahçe (İzmir)", label: "Güzelbahçe (İzmir)" },
    { value: "Kösedere (İzmir)", label: "Kösedere (İzmir)" },
    { value: "Foça (İzmir)", label: "Foça (İzmir)" },
    { value: "Kordon (İzmir)", label: "Kordon (İzmir)" },
    { value: "Karşıyaka (İzmir)", label: "Karşıyaka (İzmir)" },
    { value: "Tuzla (İzmir)", label: "Tuzla (İzmir)" },
    { value: "Karaburun Yarımadası (İzmir)", label: "Karaburun Yarımadası (İzmir)" },
    { value: "Gümüldür (İzmir)", label: "Gümüldür (İzmir)" },
    // Aydın
    { value: "Kuşadası Sevgi Plajı (Aydın)", label: "Kuşadası Sevgi Plajı (Aydın)" },
    { value: "Didim (Aydın)", label: "Didim (Aydın)" },
    // Muğla
    { value: "Güllük (Muğla)", label: "Güllük (Muğla)" },
    { value: "Bodrum Yarımadası (Muğla)", label: "Bodrum Yarımadası (Muğla)" },
    { value: "Marmaris (Muğla)", label: "Marmaris (Muğla)" },
    { value: "Fethiye Limanı (Muğla)", label: "Fethiye Limanı (Muğla)" },
    { value: "Datça Sahili (Muğla)", label: "Datça Sahili (Muğla)" },
    { value: "Gökova Körfezi (Muğla)", label: "Gökova Körfezi (Muğla)" },
    // Antalya
    { value: "Konyaaltı Sahili (Antalya)", label: "Konyaaltı Sahili (Antalya)" },
    { value: "Lara Plajı (Antalya)", label: "Lara Plajı (Antalya)" },
    { value: "Phaselis Koyu (Antalya)", label: "Phaselis Koyu (Antalya)" },
    { value: "Olimpos Koyu (Antalya)", label: "Olimpos Koyu (Antalya)" },
    { value: "Kaş ve Kalkan Koyları (Antalya)", label: "Kaş ve Kalkan Koyları (Antalya)" },
    // Adana
    { value: "Yumurtalık Mevkii (Adana)", label: "Yumurtalık Mevkii (Adana)" },
    { value: "Karataş Mevkii (Adana)", label: "Karataş Mevkii (Adana)" },
    // Mersin
    { value: "Yeşilovacık, Tisan Bölgesi (Mersin)", label: "Yeşilovacık, Tisan Bölgesi (Mersin)" },
    { value: "Susanoğlu, Yapraklı Koyu (Mersin)", label: "Susanoğlu, Yapraklı Koyu (Mersin)" },
    { value: "Taşucu (Silifke – Mersin)", label: "Taşucu (Silifke – Mersin)" }
  ]
  const fishOptions = [
    { value: "", label: "Tüm Balıklar" },
    { value: "Ahtapot", label: "Ahtapot" },
    { value: "Akya", label: "Akya" },
    { value: "Alabalık", label: "Alabalık" },
    { value: "Bakalyaro", label: "Bakalyaro" },
    { value: "Barbunya", label: "Barbunya" },
    { value: "Berlam", label: "Berlam" },
    { value: "Çinekop", label: "Çinekop" },
    { value: "Çipura", label: "Çipura" },
    { value: "Dil", label: "Dil" },
    { value: "Dülger", label: "Dülger" },
    { value: "Fener", label: "Fener" },
    { value: "Gelincik", label: "Gelincik" },
    { value: "Gümüş", label: "Gümüş" },
    { value: "Hamsi", label: "Hamsi" },
    { value: "Hani", label: "Hani" },
    { value: "İstavrit", label: "İstavrit" },
    { value: "İstakoz", label: "İstakoz" },
    { value: "İzmarit", label: "İzmarit" },
    { value: "Kalamar", label: "Kalamar" },
    { value: "Kalkan", label: "Kalkan" },
    { value: "Karagöz", label: "Karagöz" },
    { value: "Karides", label: "Karides" },
    { value: "Kefal", label: "Kefal" },
    { value: "Kılıç", label: "Kılıç Balığı" },
    { value: "Kırlangıç", label: "Kırlangıç" },
    { value: "Kofana", label: "Kofana" },
    { value: "Kolyoz", label: "Kolyoz" },
    { value: "Kupez", label: "Kupez" },
    { value: "Lagos", label: "Lagos" },
    { value: "Lahos", label: "Lahos" },
    { value: "Levrek", label: "Levrek" },
    { value: "Lipsoz", label: "Lipsoz (İskorpit)" },
    { value: "Lüfer", label: "Lüfer" },
    { value: "Mercan", label: "Mercan" },
    { value: "Mezgit", label: "Mezgit" },
    { value: "Mırmır", label: "Mırmır" },
    { value: "Mırlan", label: "Mırlan" },
    { value: "Minekop", label: "Minekop" },
    { value: "Orfoz", label: "Orfoz" },
    { value: "Orkinos", label: "Orkinos" },
    { value: "Palamut", label: "Palamut" },
    { value: "Pavurya", label: "Pavurya" },
    { value: "Pisi", label: "Pisi" },
    { value: "Sardalya", label: "Sardalya" },
    { value: "Sazan", label: "Sazan" },
    { value: "Sinarit", label: "Sinarit" },
    { value: "Somon", label: "Somon" },
    { value: "Sudak", label: "Sudak" },
    { value: "Sübye", label: "Sübye" },
    { value: "Tirsi", label: "Tirsi" },
    { value: "Torik", label: "Torik" },
    { value: "Trança", label: "Trança" },
    { value: "Turna", label: "Turna" },
    { value: "Uskumru", label: "Uskumru" },
    { value: "Yayın", label: "Yayın" },
    { value: "Yılanbalığı", label: "Yılanbalığı" },
    { value: "Zargana", label: "Zargana" },
  ]
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<Array<{id: string, name: string, avatarUrl?: string}>>([])
  const [showSearchResults, setShowSearchResults] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Array<{ id: string; type: string; actorName: string; actorId?: string; postId?: string; createdAt: string; read: boolean }>>([])
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

  // Realtime notification push (socket)
  React.useEffect(() => {
    if (!isAuthenticated) return
    const handler = (payload: any) => {
      // Prepend incoming notification and bump badge if dropdown closed
      setNotifications(prev => [{
        id: `${Date.now()}_${Math.random()}`,
        type: payload?.type || 'like',
        actorName: payload?.actorName || 'Kullanıcı',
        postId: payload?.postId,
        createdAt: formatRelativeTime(payload?.createdAt || new Date().toISOString()),
        read: false,
      }, ...prev].slice(0, 50))
      setUnreadCount(prev => prev + 1)
    }
    // Lazy import to avoid circulars
    import('../lib/socket').then(({ socketService }) => {
      socketService.onNotificationNew(handler)
    })
    return () => {
      import('../lib/socket').then(({ socketService }) => {
        socketService.removeListener('notification_new', handler as any)
      })
    }
  }, [isAuthenticated])

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
          actorId: n.actorId,
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
    <div className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-gray-900/75 backdrop-blur-xl shadow-2xl border-b border-gray-200/70 dark:border-gray-700/70'
        : 'bg-gradient-to-r from-white/80 to-blue-50/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
    }`}>
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 flex items-center gap-3 group" onClick={() => setSelectedLocation("")}>
          <Image 
            src="/logo.png" 
            width={94} 
            height={94} 
            alt="BALIKNERDE logo" 
            priority
            className="logo-float logo-hover-spin transition-all duration-300 group-hover:scale-110" 
          />
          <span 
            className="hidden sm:inline-flex items-baseline gap-1 text-2xl font-extrabold tracking-wide transition-all duration-300 group-hover:scale-105"
            style={{
              fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
              letterSpacing: '0.6px'
            }}
          >
            {/* balik: cyan → navy (brand) - daha parlak ve canlı */}
            <span 
              className="leading-none bg-clip-text text-transparent drop-shadow-sm" 
              style={{ 
                backgroundImage: 'linear-gradient(135deg, #00d4ff, #0099cc, #0066aa)',
                filter: 'brightness(1.2) saturate(1.3)',
                textShadow: '0 0 8px rgba(0, 212, 255, 0.3)'
              }}
            >
              balik
            </span>

            {/* nerde: daha büyük, hafif döndürülmüş, gradient metin + girift soru işareti - daha parlak */}
            <span
              className="relative inline-block leading-none bg-clip-text text-transparent font-black tracking-wide drop-shadow-sm"
              style={{ 
                transform: 'rotate(-8deg)', 
                fontSize: '1.25em', 
                letterSpacing: '0.02em',
                filter: 'brightness(1.3) saturate(1.4)',
                textShadow: '0 0 10px rgba(236, 35, 43, 0.4)'
              }}
            >
              <span 
                className="bg-clip-text text-transparent" 
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #ff4757, #ff3742, #ff2d3a)',
                  filter: 'brightness(1.2) saturate(1.3)'
                }}
              >
                nerde
              </span>
              {/* Girift soru işareti: metinle iç içe, sağ üstte hafifçe bindir - daha parlak */}
              <span
                aria-hidden
                className="absolute -top-1 -right-0.5 bg-clip-text text-transparent font-extrabold text-[18px] leading-none select-none drop-shadow-sm"
                style={{ 
                  transform: 'rotate(-6deg)',
                  filter: theme === 'dark' ? 'brightness(1.2) saturate(1.1)' : 'brightness(1.05) saturate(1.05)',
                  textShadow: theme === 'dark' ? '0 0 6px rgba(148, 163, 184, 0.35)' : '0 0 4px rgba(17, 17, 17, 0.35)'
                }}
              >
                <span 
                  className="bg-clip-text text-transparent" 
                  style={{ 
                    backgroundImage: theme === 'dark'
                      ? 'linear-gradient(135deg, #d1d5db, #9ca3af 45%, #4b5563 80%)'
                      : 'linear-gradient(135deg, #0f0f10, #2a2a2c 40%, #0a0a0b 75%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  ?
                </span>
              </span>
            </span>

            {/* .com: hook graphite - daha parlak */}
            <span 
              className="ml-1 align-top inline-flex items-center gap-1.5 text-[12px] drop-shadow-sm" 
              style={{ 
                color: '#9ca3af',
                filter: 'brightness(1.1)',
                textShadow: '0 0 4px rgba(156, 163, 175, 0.3)'
              }}
            >
              <span className="tracking-wide">.com</span>
            </span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 w-full max-w-xl -ml-28">
            <Link href="/" onClick={() => setSelectedLocation("")}>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200">Ana Sayfa</Button>
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
                className="pl-9 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 focus:bg-white/85 dark:focus:bg-gray-700/85 focus:border-blue-300 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 dark:focus:ring-blue-900/30 dark:text-white transition-all duration-300 search-glow hover:shadow-lg hover:shadow-blue-500/20" 
                placeholder="Ara: kullanıcı" 
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
                            <AvatarImage src={user.avatarUrl || DEFAULT_AVATAR} alt={user.name} />
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
          {user?.isAdmin && (
            <Link href="/admin">
              <Button variant="outline" className="text-gray-700 hover:text-red-600 hover:bg-red-50/80 border-gray-300/50 hover:border-red-300 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-gray-700/80 dark:border-gray-600/50 dark:hover:border-red-500 backdrop-blur-sm transition-all duration-200">
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-2 py-1">
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
              <div className="absolute right-0 mt-2 w-96 max-w-[90vw] rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b border-gray-100/80 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 rounded-t-xl">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Bildirimler</span>
                  <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={() => setShowNotifications(false)}>Kapat</button>
                </div>
                <div className="max-h-80 overflow-auto p-2 space-y-2 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Hiç bildirimin yok.
                    </div>
                  ) : notifications.map((n) => {
                    const isPost = !!n.postId
                    const icon = n.type === 'like' ? <Heart className="w-4 h-4 text-red-500" />
                      : n.type === 'follow' ? <UserPlus className="w-4 h-4 text-blue-500" />
                      : n.type === 'comment' ? <MessageCircle className="w-4 h-4 text-green-600" />
                      : <Bell className="w-4 h-4 text-indigo-600" />
                    const text = n.type === 'new_post' ? 'yeni bir gönderi paylaştı.'
                      : n.type === 'follow' ? 'seni takip etti.'
                      : n.type === 'like' ? 'gönderini beğendi.'
                      : 'gönderine yorum yaptı.'
                    return (
                      <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            <span className="font-medium">{n.actorName}</span> {text}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{n.createdAt}</p>
                        </div>
                        {isPost ? (
                          <Link href={`/p/${n.postId}`} className="text-xs text-blue-600 hover:underline dark:text-blue-400" onClick={() => setShowNotifications(false)}>Gönderi</Link>
                        ) : (
                          <Link href={`/u/${n.actorId}`} className="text-xs text-blue-600 hover:underline dark:text-blue-400" onClick={() => setShowNotifications(false)}>Profil</Link>
                        )}
                      </div>
                    )
                  })}
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
                            // Clear local state
                            logout()
                            
                            // Clear all storage
                            localStorage.clear()
                            sessionStorage.clear()
                            
                            // Clear all cookies
                            document.cookie.split(";").forEach(function(c) { 
                              document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                            });
                            
                            // Auth0 logout URL'ine yönlendir
                            const auth0Domain = 'dev-wkkkp5pu34fqe35i.us.auth0.com'
                            const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'YOUR_CLIENT_ID'
                            const returnTo = encodeURIComponent(window.location.origin)
                            const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`
                            
                            window.location.href = logoutUrl
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
          
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white/95 to-blue-50/80 dark:from-gray-900/95 dark:to-gray-800/80 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-3">
            <div className="flex gap-2">
              <Link href="/" onClick={() => { setSelectedLocation(""); setShowMobileMenu(false); }}>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 w-full">Ana Sayfa</Button>
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
                              <AvatarImage src={user.avatarUrl || DEFAULT_AVATAR} alt={user.name} />
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

