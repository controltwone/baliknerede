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
}

export default function Post({
  authorName,
  authorAvatarUrl,
  imageUrl,
  contentText,
  likeCount = 0,
  commentCount = 0,
  createdAt,
}: PostCardProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  function ensureAuth(orElse?: () => void) {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    if (orElse) orElse()
    return true
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={authorAvatarUrl} alt={authorName} />
          <AvatarFallback>{authorName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-sm">{authorName}</CardTitle>
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

      {imageUrl ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image src={imageUrl} alt="post image" fill className="object-cover" />
        </div>
      ) : null}

      {contentText ? (
        <CardContent className="pt-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{contentText}</p>
        </CardContent>
      ) : null}

      <CardFooter className="justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Beğen"
            onClick={() => ensureAuth(() => {/* TODO: like */})}
          >
            <Heart />
          </Button>
          <span className="text-sm text-muted-foreground">{likeCount}</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Yorum yap"
            onClick={() => ensureAuth(() => {/* TODO: open comments */})}
          >
            <MessageCircle />
          </Button>
          <span className="text-sm text-muted-foreground">{commentCount}</span>
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
