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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const router = useRouter()

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
                <Button variant="outline" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                        d="M22.675 0H1.325C.593 0 0 .593 0 
                        1.325v21.351C0 23.406.593 24 1.325 
                        24h11.494v-9.294H9.691v-3.622h3.128V8.413c0-3.1 
                        1.893-4.788 4.659-4.788 1.325 
                        0 2.464.099 2.796.143v3.24h-1.918c-1.504 
                        0-1.796.715-1.796 1.764v2.313h3.587l-.467 
                        3.622h-3.12V24h6.116C23.407 24 24 23.406 24 
                        22.676V1.325C24 .593 23.407 0 22.675 0z"
                        fill="currentColor"
                    />
                </svg>
                  Facebook ile giriş yap.
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google ile giriş yap.
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
                <a href="#" className="underline underline-offset-4">
                  Kaydol
                </a>
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
