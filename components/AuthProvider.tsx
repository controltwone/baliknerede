"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type AuthUser = {
  id: string
  name: string
  email?: string
  bio?: string
  avatarUrl?: string
  isAdmin?: boolean
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  token: string | null
  setUser: (user: AuthUser | null) => void
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
          if (data?.user) setUser({ id: data.user.id, name: data.user.name, email: data.user.email, bio: data.user.bio, avatarUrl: data.user.avatarUrl || "/logo.png", isAdmin: data.user.isAdmin })
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
                if (data?.user) setUser({ id: data.user.id, name: data.user.name, email: data.user.email, bio: data.user.bio, avatarUrl: data.user.avatarUrl || "/logo.png", isAdmin: data.user.isAdmin })
              }
            } catch {}
          }
        }
      } catch {}
    })()
  }, [token, API_BASE])

  // Auth0 token kontrolü - sadece sayfa yüklendiğinde bir kez
  useEffect(() => {
    const checkAuth0Token = async () => {
      // Eğer zaten token varsa Auth0 kontrolü yapma
      if (token) return
      
      try {
        console.log('Checking Auth0 token...')
        const tr = await fetch(`${API_BASE}/auth0/token`, { credentials: 'include' })
        console.log('Auth0 token response:', tr.status)
        if (tr.ok) {
          const td = await tr.json()
          console.log('Auth0 token data:', td)
          if (td?.token) {
            console.log('Setting token from Auth0')
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
                if (data?.user) {
                  console.log('Setting user from Auth0:', data.user)
                  setUser({ id: data.user.id, name: data.user.name, email: data.user.email, bio: data.user.bio, avatarUrl: data.user.avatarUrl || "/logo.png", isAdmin: data.user.isAdmin })
                }
              }
            } catch (e) {
              console.error('Error fetching user after Auth0 token:', e)
            }
          }
        }
      } catch (e) {
        console.error('Error checking Auth0 token:', e)
      }
    }

    // Sadece sayfa yüklendiğinde kontrol et
    checkAuth0Token()
  }, [API_BASE])

  // Sayfa kapandığında otomatik çıkış yap
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        // Sayfa kapanırken localStorage'ı temizle
        localStorage.removeItem('bn_auth_user')
        localStorage.removeItem('bn_token')
        sessionStorage.clear()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden && user) {
        // Sayfa gizlendiğinde (başka tab'a geçildiğinde) çıkış yap
        setTimeout(() => {
          if (document.hidden) {
            localStorage.removeItem('bn_auth_user')
            localStorage.removeItem('bn_token')
            sessionStorage.clear()
            setUser(null)
            setToken(null)
          }
        }, 30000) // 30 saniye sonra çıkış yap
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

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
    setUser({ id: data.user.id, name: data.user.name, email: data.user.email, bio: data.user.bio, avatarUrl: data.user.avatarUrl || "/logo.png" })
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
    setUser({ id: data.user.id, name: data.user.name, email: data.user.email, bio: data.user.bio, avatarUrl: data.user.avatarUrl || "/logo.png" })
  }, [API_BASE])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, signup, logout, token, setUser }),
    [user, login, signup, logout, token, setUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


