"use client"

import React, { useEffect, useState } from "react"
import { formatRelativeTime } from "../lib/time"
import Post from "@/components/Post"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "./AuthProvider"
import { useLocationFilter } from "./LocationFilterProvider"
import { PostCardSkeleton, FeedComposerSkeleton } from "./LoadingSkeleton"
import { useSocket } from "@/hooks/useSocket"
import { ConfirmationModal } from "./ui/confirmation-modal"
import { ReportModal } from "./ui/report-modal"
import { ToastManager } from "./ui/toast"
import { CustomSelect } from "./ui/custom-select"
import { DEFAULT_AVATAR } from "@/lib/constants"

type FeedPost = {
  id: string
  authorId?: string
  authorName: string
  authorAvatarUrl?: string
  imageUrl?: string
  contentText?: string
  locationCity?: string
  locationSpot?: string
  fishType?: string
  likeCount?: number
  commentCount?: number
  viewCount?: number
  createdAt?: string
  liked?: boolean
  isFollowing?: boolean
}

export default function Feed() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const { user, token, isAuthenticated } = useAuth()
  const { selectedLocation, selectedFishType } = useLocationFilter()
  const { socketService } = useSocket()

  const [contentText, setContentText] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [locationSpot, setLocationSpot] = useState<string>("")
  const [fishType, setFishType] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  const locationOptions = [
    { value: "", label: "Konum seç" },
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
    { value: "", label: "Balık türü" },
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
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<FeedPost[]>([])
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [totalPosts, setTotalPosts] = useState(0)
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [toasts, setToasts] = useState<Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    description?: string
    duration?: number
  }>>([])

  // Toast functions
  const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Handle post deletion
  const handleDeletePost = (postId: string) => {
    setSelectedPostId(postId)
    setShowDeleteModal(true)
  }

  const confirmDeletePost = async () => {
    if (!token || !selectedPostId) return
    
    setIsDeleting(true)
    try {
      const res = await fetch(`${API_BASE}/posts/${selectedPostId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (res.ok) {
        setPosts(prev => prev.filter(post => post.id !== selectedPostId))
        setShowDeleteModal(false)
        setSelectedPostId(null)
        addToast({
          type: "success",
          title: "Gönderi Silindi",
          description: "Gönderiniz başarıyla silindi."
        })
      } else {
        addToast({
          type: "error",
          title: "Hata",
          description: "Gönderi silinirken bir hata oluştu."
        })
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      addToast({
        type: "error",
        title: "Hata",
        description: "Gönderi silinirken bir hata oluştu."
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle post reporting
  const handleReportPost = (postId: string) => {
    setSelectedPostId(postId)
    setShowReportModal(true)
  }

  const confirmReportPost = async (reason: string) => {
    if (!token || !selectedPostId) return
    
    setIsReporting(true)
    try {
      const res = await fetch(`${API_BASE}/posts/${selectedPostId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      })

      if (res.ok) {
        setShowReportModal(false)
        setSelectedPostId(null)
        addToast({
          type: "success",
          title: "Şikayet Gönderildi",
          description: "Şikayetiniz alındı. İnceleme sürecine alınacaktır."
        })
      } else {
        addToast({
          type: "error",
          title: "Hata",
          description: "Şikayet gönderilirken bir hata oluştu."
        })
      }
    } catch (error) {
      console.error('Error reporting post:', error)
      addToast({
        type: "error",
        title: "Hata",
        description: "Şikayet gönderilirken bir hata oluştu."
      })
    } finally {
      setIsReporting(false)
    }
  }

  // Fetch posts with pagination
  const fetchPosts = async (page: number = 1, append: boolean = false) => {
    try {
      const res = await fetch(`${API_BASE}/posts?page=${page}&limit=20`, { 
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (!res.ok) throw new Error("Liste alınamadı")
      const data = await res.json()
      const mapped: FeedPost[] = (data.posts || []).map((p: any) => ({
        id: p._id,
        authorId: p.authorId?._id || undefined,
        authorName: p.authorId?.name || "Kullanıcı",
        authorAvatarUrl: p.authorId?.avatarUrl || DEFAULT_AVATAR,
        imageUrl: p.imageUrl,
        contentText: p.contentText,
        locationCity: p.locationCity,
        locationSpot: p.locationSpot,
        fishType: p.fishType,
        likeCount: p.likeCount || 0,
        commentCount: p.commentCount || 0,
        viewCount: p.viewCount || 0,
        createdAt: formatRelativeTime(p.createdAt),
        liked: p.liked || false,
        isFollowing: p.isFollowing || false,
      }))
      
      // Filter posts by selected location and fish type if any
      let list = mapped
      if (selectedLocation) {
        list = list.filter(p => p.locationSpot === selectedLocation)
      }
      if (selectedFishType) {
        list = list.filter(p => (p.fishType || "") === selectedFishType)
      }
      
      if (append) {
        setPosts(prev => [...prev, ...list])
      } else {
        setPosts(list)
      }
      
      setHasMore(data.pagination?.hasMore || false)
      setTotalPosts(data.pagination?.totalPosts || 0)
      setCurrentPage(page)
      
      return { posts: list, hasMore: data.pagination?.hasMore || false }
    } catch (e: any) {
      setError(e?.message || "Bir hata oluştu")
      throw e
    }
  }

  // Load more posts
  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    try {
      await fetchPosts(currentPage + 1, true)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleFollow = async (authorId: string) => {
    if (!isAuthenticated) {
      alert('Takip etmek için giriş yapmalısınız.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/follow/${authorId}`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (response.ok) {
        // Update the post's follow status
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.authorId === authorId 
              ? { ...post, isFollowing: true }
              : post
          )
        )
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  // Initial load and filter changes
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      setCurrentPage(1)
      try {
        await fetchPosts(1, false)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Bir hata oluştu")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [API_BASE, selectedLocation, selectedFishType])

  // Scroll to post from notification link
  useEffect(() => {
    const postId = searchParams?.get('post')
    if (!postId) return
    const t = setTimeout(() => {
      const el = document.getElementById(`post-${postId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        el.classList.add('ring-2', 'ring-blue-400')
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-blue-400')
        }, 2000)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [posts])

  // Socket event listeners for real-time updates
  useEffect(() => {
    console.log('Setting up socket listeners in Feed')
    
    // Listen for new posts
    const handlePostCreated = (data: any) => {
      console.log('Received post_created event:', data)
      if (data.post) {
        // Don't add our own posts (they're already added locally)
        if (data.post.authorId?._id === user?.id) {
          console.log('Skipping own post from socket event')
          return
        }
        const newPost: FeedPost = {
          id: data.post._id,
          authorId: data.post.authorId?._id || undefined,
          authorName: data.post.authorId?.name || "Kullanıcı",
          authorAvatarUrl: data.post.authorId?.avatarUrl || DEFAULT_AVATAR,
          imageUrl: data.post.imageUrl,
          contentText: data.post.contentText,
          locationCity: data.post.locationCity,
          locationSpot: data.post.locationSpot,
          fishType: data.post.fishType,
          likeCount: data.post.likeCount || 0,
          commentCount: data.post.commentCount || 0,
          viewCount: data.post.viewCount || 0,
          createdAt: formatRelativeTime(data.post.createdAt),
          liked: false
        }
        
        console.log('Adding new post to feed:', newPost)
        setPosts(prev => {
          // Check if post already exists to prevent duplicates
          const exists = prev.some(post => post.id === newPost.id)
          if (exists) {
            console.log('Post already exists, skipping duplicate')
            return prev
          }
          // Add new post to the beginning and update total count
          setTotalPosts(prev => prev + 1)
          return [newPost, ...prev]
        })
      }
    }

    socketService.onPostCreated(handlePostCreated)

    return () => {
      console.log('Cleaning up socket listeners in Feed')
      socketService.removeListener('post_created', handlePostCreated)
    }
  }, [socketService, user?.id])

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
    if (!user) {
      setError("Paylaşmak için giriş yapmalısınız.")
      return
    }
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
        body: JSON.stringify({ contentText, imageUrl: finalImageUrl, locationCity: "İstanbul", locationSpot, fishType }),
      })
      if (res.status === 401) {
        setError("Paylaşmak için giriş yapmalısınız.")
        return
      }
      if (!res.ok) throw new Error("Gönderi paylaşılamadı.")
      const data = await res.json()
      const p = data.post
      const newPost: FeedPost = {
        id: p._id,
        authorName: user?.name || "Sen",
        authorAvatarUrl: user?.avatarUrl || DEFAULT_AVATAR,
        imageUrl: p.imageUrl,
        contentText: p.contentText,
        locationCity: p.locationCity,
        locationSpot: p.locationSpot,
        fishType: p.fishType,
        likeCount: p.likeCount || 0,
        commentCount: p.commentCount || 0,
        createdAt: formatRelativeTime(p.createdAt),
      }
      setPosts((prev) => {
        // Check if post already exists to prevent duplicates
        const exists = prev.some(post => post.id === newPost.id)
        if (exists) {
          console.log('Post already exists, skipping duplicate')
          return prev
        }
        return [newPost, ...prev]
      })
      setContentText("")
      setImageUrl(undefined)
      setSelectedFile(null)
      setLocationSpot("")
      setFishType("")
    } catch (e: any) {
      setError(e?.message || "Paylaşım sırasında hata")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-2 sm:px-0 page-stagger">
      <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white/90 to-blue-50/40 dark:from-gray-800/90 dark:to-gray-700/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 hover:scale-[1.01]">
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
                  <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start items-stretch">
                    <CustomSelect
                      options={locationOptions}
                      value={locationSpot}
                      onChange={setLocationSpot}
                      placeholder="Konum seç"
                      className="w-full sm:flex-1 sm:max-w-none"
                      showIcon={true}
                      iconLabel="Konum"
                    />
                <CustomSelect
                  options={fishOptions}
                  value={fishType}
                  onChange={setFishType}
                  placeholder="Balık türü"
                  className="w-full sm:flex-1 sm:max-w-none"
                  showIcon={true}
                  iconLabel="Balık"
                  searchPlaceholder="Balık ara..."
                  notFoundText="Balık bulunamadı"
                />
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
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
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200 p-3 flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium">{error}</p>
                <div className="mt-2 flex gap-2">
                  <Link href="/login">
                    <Button size="sm" className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white">Giriş Yap</Button>
                  </Link>
                  <Button size="sm" variant="ghost" className="h-8 px-3" onClick={() => setError(null)}>Kapat</Button>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-6">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : (
        <div className="flex flex-col gap-6 custom-scrollbar">
          {posts.map((p) => (
            <Post 
              key={p.id} 
              {...p} 
              onDelete={handleDeletePost}
              onReport={handleReportPost}
              onFollow={handleFollow}
            />
          ))}
          {posts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Henüz gönderi yok.</p>
          ) : null}
          
          {/* Load More Button */}
          {hasMore && posts.length > 0 && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={loadMorePosts}
                disabled={isLoadingMore}
                variant="outline"
                className="px-8 py-2 bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200 hover:scale-105"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    Yükleniyor...
                  </div>
                ) : (
                  'Daha fazla yükle'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedPostId(null)
        }}
        onConfirm={confirmDeletePost}
        title="Gönderiyi Sil"
        description="Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        type="delete"
        isLoading={isDeleting}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false)
          setSelectedPostId(null)
        }}
        onReport={confirmReportPost}
        isLoading={isReporting}
      />

      {/* Toast Manager */}
      <ToastManager toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}


