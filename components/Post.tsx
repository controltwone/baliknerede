"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Lock, LogIn, MapPin, Trash2, Flag } from "lucide-react"
import { useAuth } from "./AuthProvider"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import React from "react"
import { formatRelativeTime } from '../lib/time'
import { LoadingSpinner } from "./LoadingSkeleton"
import { useSocket } from "@/hooks/useSocket"

type PostCardProps = {
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
  onDelete?: (postId: string) => void
  onReport?: (postId: string) => void
}

export default function Post({
  id,
  authorId,
  authorName,
  authorAvatarUrl,
  imageUrl,
  contentText,
  locationCity,
  locationSpot,
  fishType,
  likeCount = 0,
  commentCount = 0,
  viewCount = 0,
  createdAt,
  liked = false,
  onDelete,
  onReport,
}: PostCardProps) {
  const { isAuthenticated, token, user } = useAuth()
  const router = useRouter()
  const { socketService } = useSocket()
  
  // Check if this is the user's own post
  const isOwnPost = isAuthenticated && user && authorId === user.id
  const [showAuthModal, setShowAuthModal] = React.useState(false)
  const [likes, setLikes] = React.useState(likeCount)
  const [comments, setComments] = React.useState(commentCount)
  const [views, setViews] = React.useState(viewCount)
  const [isLiking, setIsLiking] = React.useState(false)
  const [isLiked, setIsLiked] = React.useState(liked)
  const [showCommentBox, setShowCommentBox] = React.useState(false)
  const [showMenu, setShowMenu] = React.useState(false)
  const [commentText, setCommentText] = React.useState("")
  const [isCommenting, setIsCommenting] = React.useState(false)
  const [isLoadingComments, setIsLoadingComments] = React.useState(false)
  const [commentList, setCommentList] = React.useState<Array<{ userId: string; userName?: string; text: string; createdAt: string }>>([])
  const [visibleComments, setVisibleComments] = React.useState(5) // İlk 5 yorumu göster
  const [isLoadingMoreComments, setIsLoadingMoreComments] = React.useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const hasImage = !!imageUrl

  // Daha fazla yorum göster
  const loadMoreComments = () => {
    setIsLoadingMoreComments(true)
    setTimeout(() => {
      setVisibleComments(prev => Math.min(prev + 5, commentList.length))
      setIsLoadingMoreComments(false)
    }, 500) // Loading efekti için
  }

  // Yorumlar değiştiğinde visible comments'i sıfırla
  React.useEffect(() => {
    setVisibleComments(5)
  }, [commentList.length])

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showMenu])

  // Socket event listeners
  React.useEffect(() => {
    console.log('Setting up socket listeners for post:', id)
    
    // Listen for like updates
    const handleLikeUpdate = (data: any) => {
      console.log('Received post_like_updated event:', data)
      if (data.postId === id) {
        setLikes(data.likeCount)
        setIsLiked(data.liked)
      }
    }

    // Listen for view updates (only for non-admin users)
    const handleViewUpdate = (data: any) => {
      console.log('Received post_view_updated event:', data)
      if (data.postId === id && !user?.isAdmin) {
        setViews(data.viewCount)
      }
    }

    socketService.onPostLikeUpdated(handleLikeUpdate)
    socketService.onPostViewUpdated(handleViewUpdate)

    return () => {
      console.log('Cleaning up socket listeners for post:', id)
      socketService.removeListener('post_like_updated', handleLikeUpdate)
      socketService.removeListener('post_view_updated', handleViewUpdate)
    }
  }, [id, socketService])

  // Track view when component mounts (only for non-admin users)
  React.useEffect(() => {
    const trackView = async () => {
      // Don't track views for admins
      if (user?.isAdmin) {
        return
      }

      // Check if we've already viewed this post in this session
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]')
      if (viewedPosts.includes(id)) {
        return // Already viewed this post in this session
      }

      try {
        const res = await fetch(`${API_BASE}/posts/${id}/view`, {
          method: 'POST',
          credentials: 'include'
        })
        
        if (res.ok) {
          const data = await res.json()
          if (data.viewCount) {
            // Mark this post as viewed in this session
            viewedPosts.push(id)
            sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts))
            
            // Emit socket event for real-time updates
            socketService.emitPostViewed({
              postId: id,
              viewCount: data.viewCount
            })
          }
        }
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }

    trackView()
  }, [id, user?.isAdmin])

  // For admins: get view count without incrementing
  React.useEffect(() => {
    const getViewCount = async () => {
      if (!user?.isAdmin) return

      try {
        const res = await fetch(`${API_BASE}/posts/${id}/view`, {
          method: 'GET',
          credentials: 'include'
        })
        
        if (res.ok) {
          const data = await res.json()
          if (data.viewCount !== undefined) {
            setViews(data.viewCount)
          }
        }
      } catch (error) {
        console.error('Failed to get view count:', error)
      }
    }

    getViewCount()
  }, [id, user?.isAdmin, API_BASE])

  function ensureAuth(orElse?: () => void) {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    if (orElse) orElse()
    return true
  }

  return (
    <Card className={`w-full max-w-xl mx-auto transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 hover:-translate-y-1 ${hasImage ? 'bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-700/30' : 'bg-gradient-to-br from-muted/30 to-blue-100/20 dark:from-gray-800/30 dark:to-gray-700/20 border-dashed'}`}>
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Link href={authorId ? `/u/${authorId}` : '#'}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={authorAvatarUrl} alt={authorName} />
            <AvatarFallback>{authorName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={authorId ? `/u/${authorId}` : '#'}>
            <CardTitle className={`text-sm hover:underline dark:text-white ${hasImage ? '' : 'text-foreground/90 dark:text-foreground/90'}`}>{authorName}</CardTitle>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {createdAt ? (
            <span className="text-xs text-muted-foreground dark:text-gray-400 hidden sm:inline">{createdAt}</span>
          ) : null}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 transition-all duration-200 hover:scale-110 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal />
            </Button>
            
            {/* Menu Dropdown */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                {isOwnPost ? (
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      onDelete?.(id)
                    }}
                    className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Gönderiyi Sil
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      onReport?.(id)
                    }}
                    className="w-full px-4 py-3 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-3 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    Şikayet Et
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {hasImage ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden group">
          <Image src={imageUrl} alt="post image" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : null}

      {contentText ? (
        <CardContent className={`${hasImage ? 'pt-4' : 'pt-3'}`}>
          <p className={`whitespace-pre-wrap dark:text-white ${hasImage ? 'text-sm leading-relaxed' : 'text-base leading-7'}`}>{contentText}</p>
        </CardContent>
      ) : null}

      {showCommentBox ? (
        <CardContent className="pt-2">
          <div className="flex items-start gap-2">
            <textarea
              className="min-h-16 w-full rounded-md border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              placeholder="Yorum yaz..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              disabled={isCommenting || !commentText.trim()}
              onClick={async () => {
                const text = commentText.trim()
                if (!text) return
                await ensureAuth(async () => {
                  try {
                    setIsCommenting(true)
              const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ text }),
              })
                    if (!res.ok) return
                    const data = await res.json()
                    if (typeof data.commentCount === 'number') setComments(data.commentCount)
                    setCommentText("")
                    // refresh comments list
                    const lr = await fetch(`${API_BASE}/posts/${id}/comments`)
                    if (lr.ok) {
                      const ld = await lr.json()
                      setCommentList((ld.comments || []).map((c: any) => ({
                        userId: String(c.userId), userName: c.userName, text: c.text, createdAt: c.createdAt
                      })))
                    }
                  } finally {
                    setIsCommenting(false)
                  }
                })
              }}
            >
              Gönder
            </Button>
          </div>
          <div className="mt-3 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoadingComments ? (
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {commentList.slice(0, visibleComments).map((c, i) => (
                  <div key={i} className="rounded-md border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{c.userName || 'Kullanıcı'}</span>
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">{c.text}</p>
                  </div>
                ))}
                
                {/* Daha fazla yorum göster butonu */}
                {commentList.length > visibleComments && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadMoreComments}
                      disabled={isLoadingMoreComments}
                      className="text-xs px-3 py-1 h-7 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {isLoadingMoreComments ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                          <span>Yükleniyor...</span>
                        </div>
                      ) : (
                        `+${commentList.length - visibleComments} yorum daha göster`
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
            {commentList.length === 0 && !isLoadingComments ? (
              <p className="text-xs text-muted-foreground text-center py-4">Henüz yorum yok.</p>
            ) : null}
          </div>
        </CardContent>
      ) : null}

      <CardFooter className="justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Beğen"
            disabled={isLiking}
            className="transition-all duration-200 hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
            onClick={() => ensureAuth(async () => {
              try {
                setIsLiking(true)
                const res = await fetch(`${API_BASE}/posts/${id}/like`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                })
                if (!res.ok) return
                const data = await res.json()
                if (typeof data.likeCount === 'number') {
                  setLikes(data.likeCount)
                  setIsLiked(data.liked) // Backend'den gelen beğeni durumunu kullan
                  
                  // Emit socket event for real-time updates
                  socketService.emitPostLiked({
                    postId: id,
                    likeCount: data.likeCount,
                    liked: data.liked
                  })
                }
              } finally {
                setIsLiking(false)
              }
            })}
          >
            {isLiking ? <LoadingSpinner size="sm" /> : <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} />}
          </Button>
          <span className="text-sm text-muted-foreground">{likes}</span>
          {user?.isAdmin && (
            <span className="text-xs text-muted-foreground ml-2">👁️ {views}</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Yorum yap"
            className="transition-all duration-200 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500"
            onClick={() => ensureAuth(async () => {
              const newState = !showCommentBox
              setShowCommentBox(newState)
              if (newState) {
                try {
                  setIsLoadingComments(true)
                  const res = await fetch(`${API_BASE}/posts/${id}/comments`)
                  if (res.ok) {
                    const data = await res.json()
                    setCommentList((data.comments || []).map((c: any) => ({
                      userId: String(c.userId), userName: c.userName, text: c.text, createdAt: c.createdAt
                    })))
                  }
                } finally {
                  setIsLoadingComments(false)
                }
              }
            })}
          >
            <MessageCircle />
          </Button>
          <span className="text-sm text-muted-foreground">{comments}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(locationCity || locationSpot) ? (
            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1.5 max-w-[200px] sm:max-w-none">
              <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] font-medium text-gray-700 truncate">
                {locationCity || ''}{locationCity && locationSpot ? ' • ' : ''}{locationSpot || ''}
              </span>
            </div>
          ) : null}

          {fishType ? (
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded-full">
              {fishType}
            </span>
          ) : null}

          {!(locationCity || locationSpot || fishType) ? (
            <Button variant="ghost" size="icon" aria-label="Kaydet" className="shrink-0">
              <Bookmark />
            </Button>
          ) : null}
        </div>
      </CardFooter>

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
                <DialogPanel className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-lg">
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-base font-semibold">
                      <Lock className="h-4 w-4" />
                      Giriş gerekli
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Beğeni ve yorum yapabilmek için önce giriş yapmalısınız.
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={() => setShowAuthModal(false)}>İptal</Button>
                      <Button onClick={() => { setShowAuthModal(false); router.push('/login') }}>
                        <LogIn className="mr-2 h-4 w-4" /> Giriş Yap
                      </Button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Card>
  )
}

