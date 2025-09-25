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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-4 mb-6">
        <Link href="/" className="flex flex-col items-center gap-3">
          <Image src="/logo.png" width={64} height={64} alt="BALIKNEREDE logo" />
          <span className="text-2xl font-bold" style={{color: '#158EC3'}}>baliknerede.com</span>
        </Link>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Giriş Yap</CardTitle>
          <CardDescription>
                Google veya Facebook hesabınızla giriş yapın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={() => { window.location.href = `${API_BASE}/auth0/login` }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google ile giriş yap
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Mail ile devam et
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@gmail.com"
                    required
                    name="email"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Şifre</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Şifremi unuttum.
                    </a>
                  </div>
                  <Input id="password" type="password" required name="password" />
                </div>
                <Button type="submit" className="w-full">
                  Giriş Yap
                </Button>
              </div>
              <div className="text-center text-sm">
                Hesabın yok mu?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Kaydol
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Devam ederseniz, <a href="#">Hizmet Şartlarını</a>{" "}
        ve <a href="#">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
      </div>
    </div>
  )
}

export default LoginForm
