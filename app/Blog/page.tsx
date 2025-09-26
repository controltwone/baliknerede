"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { articles } from "./data"

export default function BlogPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Parallax Background */}
      <div 
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23158EC3" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating Elements */}
      <div 
        className="fixed top-20 right-10 text-6xl opacity-10 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        🐟
      </div>
      <div 
        className="fixed top-40 left-10 text-4xl opacity-10 pointer-events-none"
        style={{ transform: `translateY(${scrollY * -0.2}px)` }}
      >
        🎣
      </div>
      <div 
        className="fixed bottom-20 right-20 text-5xl opacity-10 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        🌊
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div 
          className="mb-6"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <h1 className="text-2xl font-semibold dark:text-white">Blog</h1>
          <p className="text-muted-foreground dark:text-gray-400">Balık türleri, ipuçları ve ekipman önerileri</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, index) => (
            <Link
              key={a.id}
              href={`/blog/${a.id}`}
              className="group block rounded-xl border bg-gradient-to-br from-white/90 to-blue-50/40 dark:from-gray-800/90 dark:to-gray-700/40 dark:border-gray-600 p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ 
                transform: `translateY(${scrollY * (0.05 + index * 0.01)}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">{a.title}</h2>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">🎣</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">{a.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.tags.map((t) => (
                  <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground dark:text-gray-400 dark:border-gray-600 group-hover:bg-blue-50 dark:group-hover:bg-gray-700 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

