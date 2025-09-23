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
    if (token && !user) {
      fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (data?.user) setUser({ id: data.user.id, name: data.user.name, avatarUrl: "/logo.png" })
        })
        .catch(() => {})
    }
  }, [token, user, API_BASE])

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
    () => ({ user, isAuthenticated: !!user, login, signup, logout }),
    [user, login, signup, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


