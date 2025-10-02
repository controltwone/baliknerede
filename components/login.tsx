"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "./AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") || "")
    const password = String(formData.get("password") || "")
    await login(email, password)
    router.push("/")
  }
  return (
    <div className={cn("min-h-[80vh] flex items-center justify-center px-4 py-12", className)} {...props}>
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        {/* Brand Panel */}
        <div className="hidden lg:flex lg:col-span-1 flex-col justify-center gap-4 px-2 self-stretch">
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Balıkçıların buluşma noktası
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-cyan)' }} /> Paylaş ve keşfet</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-cyan)' }} /> Konum ve balık türü filtreleri</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-cyan)' }} /> Anlık bildirimler</li>
            </ul>
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex items-start justify-center lg:col-span-2">
          <Card className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-2xl">
            <CardHeader className="text-center p-8 pb-4">
              <CardTitle className="text-2xl font-semibold">Giriş Yap</CardTitle>
              <CardDescription className="mt-1">Google ile veya e‑posta/şifre ile devam edin.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="space-y-6">
                <Button variant="outline" className="w-full h-11 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => { window.location.href = `${API_BASE}/auth0/login` }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                  </svg>
                  Google ile giriş yap
                </Button>

                <div className="after:border-border relative text-center text-sm my-2 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-3">Mail ile devam et</span>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@gmail.com" required name="email" className="w-full h-11" />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Şifre</Label>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">Şifremi unuttum.</a>
                      </div>
                      <Input id="password" type="password" required name="password" className="w-full h-11" />
                    </div>
                    <Button type="submit" className="w-full h-11 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Giriş Yap</Button>
                  </div>
                </form>

                <div className="text-center text-sm">Hesabın yok mu? <Link href="/signup" className="underline underline-offset-4">Kaydol</Link></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
