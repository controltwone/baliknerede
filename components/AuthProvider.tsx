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

  // Auth0 token kontrolü - sadece URL parameter'dan (Google login için)
  useEffect(() => {
    const checkAuth0Token = async () => {
      // Eğer zaten token varsa Auth0 kontrolü yapma
      if (token) return
      
      // Sadece URL parameter'ından token'ı kontrol et (Google login callback)
      const urlParams = new URLSearchParams(window.location.search)
      const urlToken = urlParams.get('token')
      
      if (urlToken) {
        console.log('Found token in URL parameter')
        setToken(urlToken)
        localStorage.setItem('bn_token', urlToken)
        
        // URL'den token'ı temizle
        const newUrl = window.location.pathname
        window.history.replaceState({}, document.title, newUrl)
        
        // Token ile kullanıcı bilgilerini al
        try {
          const res = await fetch(`${API_BASE}/me`, {
            headers: { Authorization: `Bearer ${urlToken}` },
            credentials: 'include',
          })
          console.log('Me response after URL token:', res.status)
          if (res.ok) {
            const data = await res.json()
            console.log('Me data after URL token:', data)
            if (data?.user) {
              console.log('Setting user from URL token:', data.user)
              setUser({ id: data.user.id, name: data.user.name, email: data.user.email, bio: data.user.bio, avatarUrl: data.user.avatarUrl || "/logo.png", isAdmin: data.user.isAdmin })
            }
          }
        } catch (e) {
          console.error('Error fetching user after URL token:', e)
        }
        return
      }
      
      // Auth0 cookie kontrolü kaldırıldı - sadece manuel giriş yapılabilir
      console.log('No URL token found, user must login manually')
    }

    // Sadece sayfa yüklendiğinde kontrol et
    checkAuth0Token()
  }, [API_BASE])

  // Otomatik çıkış sistemi kaldırıldı - kullanıcı manuel çıkış yapmalı

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
    // Disconnect socket first (sync)
    try {
      const socketService = require('../lib/socket').default
      socketService.disconnect()
    } catch (error) {
      console.warn('Socket disconnect failed:', error)
    }
    
    // Clear state
    setUser(null)
    setToken(null)
    
    // Clear localStorage
    localStorage.removeItem('bn_auth_user')
    localStorage.removeItem('bn_token')
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, signup, logout, token, setUser }),
    [user, login, signup, logout, token, setUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


