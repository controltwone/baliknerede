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
  token: string | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("bn_auth_user")
      const rawToken = localStorage.getItem("bn_token")
      if (rawUser) setUser(JSON.parse(rawUser))
      if (rawToken) setToken(rawToken)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (user) localStorage.setItem("bn_auth_user", JSON.stringify(user))
      else localStorage.removeItem("bn_auth_user")
    } catch {}
  }, [user])

  useEffect(() => {
    try {
      if (token) localStorage.setItem("bn_token", token)
      else localStorage.removeItem("bn_token")
    } catch {}
  }, [token])

  useEffect(() => {
    // bootstrap user: önce cookie'den /me, başarısızsa token endpointinden token alıp tekrar dene
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.user) setUser({ id: data.user.id, name: data.user.name, avatarUrl: "/logo.png" })
          return
        }
      } catch {}
      try {
        const tr = await fetch(`${API_BASE}/auth0/token`, { credentials: 'include' })
        if (tr.ok) {
          const td = await tr.json()
          if (td?.token) {
            setToken(td.token)
            localStorage.setItem('bn_token', td.token)
            // Token'ı aldıktan sonra /me'yi tekrar dene
            try {
              const res = await fetch(`${API_BASE}/me`, {
                headers: { Authorization: `Bearer ${td.token}` },
                credentials: 'include',
              })
              if (res.ok) {
                const data = await res.json()
                if (data?.user) setUser({ id: data.user.id, name: data.user.name, avatarUrl: "/logo.png" })
              }
            } catch {}
          }
        }
      } catch {}
    })()
  }, [token, API_BASE])

  // Auth0 callback'inden sonra token'ı kontrol et (sadece token yoksa)
  useEffect(() => {
    const checkAuth0Token = async () => {
      // Eğer zaten token varsa Auth0 kontrolü yapma
      if (token) return
      
      try {
        const tr = await fetch(`${API_BASE}/auth0/token`, { credentials: 'include' })
        if (tr.ok) {
          const td = await tr.json()
          if (td?.token) {
            // Token'ı güncelle
            setToken(td.token)
            localStorage.setItem('bn_token', td.token)
            // Token'ı aldıktan sonra /me'yi tekrar dene
            try {
              const res = await fetch(`${API_BASE}/me`, {
                headers: { Authorization: `Bearer ${td.token}` },
                credentials: 'include',
              })
              if (res.ok) {
                const data = await res.json()
                if (data?.user) setUser({ id: data.user.id, name: data.user.name, avatarUrl: "/logo.png" })
              }
            } catch {}
          }
        }
      } catch {}
    }

    // İlk yüklemede kontrol et
    checkAuth0Token()
    
    // Her 5 saniyede bir kontrol et (Auth0 callback'ini yakalamak için)
    const interval = setInterval(checkAuth0Token, 5000)
    return () => clearInterval(interval)
  }, [token, API_BASE])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(txt || 'Login failed')
    }
    const data = await res.json()
    setToken(data.token)
    setUser({ id: data.user.id, name: data.user.name, avatarUrl: "/logo.png" })
  }, [API_BASE])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) throw new Error('Signup failed')
    const data = await res.json()
    setToken(data.token)
    setUser({ id: data.user.id, name: data.user.name, avatarUrl: "/logo.png" })
  }, [API_BASE])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, signup, logout, token }),
    [user, login, signup, logout, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


