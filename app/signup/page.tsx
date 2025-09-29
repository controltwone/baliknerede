"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import React from "react"

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") || "")
    const email = String(data.get("email") || "")
    const password = String(data.get("password") || "")
    await signup(name, email, password)
    router.push("/")
  }

  return (
    <div className="bg-background dark:bg-gray-900 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-4 mb-2">
          <Link href="/" className="flex flex-col items-center gap-3">
            <Image src="/logo.png" width={64} height={64} alt="BALIKNEREDE logo" />
            <span className="text-2xl font-bold" style={{color: '#158EC3'}}>baliknerede.com</span>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Kayıt Ol</CardTitle>
            <CardDescription>Topluluğa katıl ve av paylaşımlarını yap.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Ad</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Şifre</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Kaydol</Button>
            </form>
            <div className="text-center text-sm mt-4">
              Zaten hesabın var mı?{" "}
              <Link href="/login" className="underline underline-offset-4">Giriş Yap</Link>
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          Devam ederseniz, <a href="#">Hizmet Şartlarını</a>{" "}
          ve <a href="#">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
        </div>
      </div>
    </div>
  )
}


