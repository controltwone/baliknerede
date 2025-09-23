"use client"
import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login")
  }, [isAuthenticated, router])
  if (!isAuthenticated) return null

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <section className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/logo.png" alt="avatar" />
            <AvatarFallback>{(user?.name || 'BN').slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{user?.name || 'Kullanıcı'}</h1>
            <p className="text-sm text-muted-foreground">Balık meraklısı • İstanbul</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Profili Düzenle</Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold">24</div>
            <div className="text-muted-foreground">Gönderi</div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-base font-semibold">Gönderiler</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/600/600?random=${i + 10}`}
                alt="post"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

