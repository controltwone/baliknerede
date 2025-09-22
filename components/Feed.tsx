"use client"

import React from "react"
import Post from "@/components/Post"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TextareaHTMLAttributes, useState } from "react"

type FeedPost = {
  id: string
  authorName: string
  authorAvatarUrl?: string
  imageUrl?: string
  contentText?: string
  likeCount?: number
  commentCount?: number
  createdAt?: string
}

export default function Feed() {
  const [contentText, setContentText] = useState("")
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [isPosting, setIsPosting] = useState(false)
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: "1",
      authorName: "Ahmet Yılmaz",
      authorAvatarUrl: "/logo.png",
      imageUrl: "https://picsum.photos/800/1000?random=1",
      contentText: "Bugün Boğaz’da güzel bir lüfer yakaladım! #lüfer #istanbul",
      likeCount: 12,
      commentCount: 3,
      createdAt: "2s",
    },
    {
      id: "2",
      authorName: "Zeynep Kaya",
      authorAvatarUrl: "/logo.png",
      imageUrl: "https://picsum.photos/800/1000?random=2",
      contentText: "Sabah suyunda çinekop bereketi",
      likeCount: 5,
      commentCount: 1,
      createdAt: "10d",
    },
  ])

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleShare() {
    if (!contentText && !imageUrl) return
    setIsPosting(true)
    // mock delay
    await new Promise((r) => setTimeout(r, 500))
    const newPost: FeedPost = {
      id: String(Date.now()),
      authorName: "Sen",
      authorAvatarUrl: "/logo.png",
      imageUrl,
      contentText,
      likeCount: 0,
      commentCount: 0,
      createdAt: "az önce",
    }
    setPosts((prev) => [newPost, ...prev])
    setContentText("")
    setImageUrl(undefined)
    setIsPosting(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Bir şeyler paylaş</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <textarea
            className="min-h-24 w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            placeholder="Bugün nerede, ne yakaladın?"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
          />
          <div className="flex items-center justify-between gap-3">
            <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
            <Button onClick={handleShare} disabled={isPosting || (!contentText && !imageUrl)}>
              {isPosting ? "Paylaşılıyor..." : "Paylaş"}
            </Button>
          </div>
          {imageUrl ? (
            <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {posts.map((p) => (
          <Post key={p.id} {...p} />
        ))}
      </div>
    </div>
  )
}


