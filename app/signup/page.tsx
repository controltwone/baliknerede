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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        {/* Brand Panel */}
        <div className="hidden lg:flex lg:col-span-1 flex-col justify-center gap-4 px-2">
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Aramıza katıl</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">Favori avlarını paylaş, balık türü ve konuma göre filtrele, anlık bildirimlerle haberdar ol.</p>
        </div>

        {/* Form Panel */}
        <div className="flex items-start justify-center lg:col-span-2">
          <Card className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-2xl">
            <CardHeader className="text-center p-8 pb-4">
              <CardTitle className="text-2xl font-semibold">Kayıt Ol</CardTitle>
              <CardDescription className="mt-1">Topluluğa katılmak için bilgilerini doldur.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <form onSubmit={onSubmit} className="space-y-5 w-full">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input id="name" name="name" required className="h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input id="password" name="password" type="password" required className="h-11" />
                </div>
                <Button type="submit" className="w-full h-11">Kaydol</Button>
                <div className="text-center text-sm">Zaten hesabın var mı? <Link href="/login" className="underline underline-offset-4">Giriş Yap</Link></div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


