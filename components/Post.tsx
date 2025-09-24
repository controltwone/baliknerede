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
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Lock, LogIn } from "lucide-react"
import { useAuth } from "./AuthProvider"
import { useRouter } from "next/navigation"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import React from "react"

type PostCardProps = {
  id: string
  authorName: string
  authorAvatarUrl?: string
  imageUrl?: string
  contentText?: string
  likeCount?: number
  commentCount?: number
  createdAt?: string
  liked?: boolean
}

export default function Post({
  id,
  authorName,
  authorAvatarUrl,
  imageUrl,
  contentText,
  likeCount = 0,
  commentCount = 0,
  createdAt,
  liked = false,
}: PostCardProps) {
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = React.useState(false)
  const [likes, setLikes] = React.useState(likeCount)
  const [comments, setComments] = React.useState(commentCount)
  const [isLiking, setIsLiking] = React.useState(false)
  const [isLiked, setIsLiked] = React.useState(liked)
  const [showCommentBox, setShowCommentBox] = React.useState(false)
  const [commentText, setCommentText] = React.useState("")
  const [isCommenting, setIsCommenting] = React.useState(false)
  const [isLoadingComments, setIsLoadingComments] = React.useState(false)
  const [commentList, setCommentList] = React.useState<Array<{ userId: string; userName?: string; text: string; createdAt: string }>>([])
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  const hasImage = !!imageUrl

  function ensureAuth(orElse?: () => void) {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    if (orElse) orElse()
    return true
  }

  return (
    <Card className={`w-full max-w-xl ${hasImage ? '' : 'bg-muted/30 border-dashed'}`}>
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={authorAvatarUrl} alt={authorName} />
          <AvatarFallback>{authorName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className={`text-sm ${hasImage ? '' : 'text-foreground/90'}`}>{authorName}</CardTitle>
          {createdAt ? (
            <CardDescription>{createdAt}</CardDescription>
          ) : null}
        </div>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>

      {hasImage ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image src={imageUrl} alt="post image" fill className="object-cover" />
        </div>
      ) : null}

      {contentText ? (
        <CardContent className={`${hasImage ? 'pt-4' : 'pt-3'}`}>
          <p className={`whitespace-pre-wrap ${hasImage ? 'text-sm leading-relaxed' : 'text-base leading-7'}`}>{contentText}</p>
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
                        userId: String(c.userId), userName: c.userName, text: c.text, createdAt: new Date(c.createdAt).toLocaleString()
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
          <div className="mt-3 space-y-2">
            {isLoadingComments ? (
              <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              commentList.map((c, i) => (
                <div key={i} className="rounded-md border p-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.userName || 'Kullanıcı'}</span>
                    <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap">{c.text}</p>
                </div>
              ))
            )}
            {commentList.length === 0 && !isLoadingComments ? (
              <p className="text-xs text-muted-foreground">Henüz yorum yok.</p>
            ) : null}
          </div>
        </CardContent>
      ) : null}

      <CardFooter className="justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Beğen"
            disabled={isLiking}
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
                }
              } finally {
                setIsLiking(false)
              }
            })}
          >
            <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} />
          </Button>
          <span className="text-sm text-muted-foreground">{likes}</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Yorum yap"
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
                      userId: String(c.userId), userName: c.userName, text: c.text, createdAt: new Date(c.createdAt).toLocaleString()
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
        <Button variant="ghost" size="icon" aria-label="Kaydet">
          <Bookmark />
        </Button>
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

