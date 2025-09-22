"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type AuthUser = {
  id: string
  name: string
  avatarUrl?: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bn_auth_user")
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (user) localStorage.setItem("bn_auth_user", JSON.stringify(user))
      else localStorage.removeItem("bn_auth_user")
    } catch {}
  }, [user])

  const login = useCallback(async (email: string, _password: string) => {
    // TODO: Replace with real API call
    await new Promise((r) => setTimeout(r, 300))
    setUser({ id: "demo", name: email.split("@")[0] || "Kullanıcı", avatarUrl: "/logo.png" })
  }, [])

  const signup = useCallback(async (name: string, _email: string, _password: string) => {
    // TODO: Replace with real API call
    await new Promise((r) => setTimeout(r, 300))
    setUser({ id: String(Date.now()), name, avatarUrl: "/logo.png" })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, signup, logout }),
    [user, login, signup, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


