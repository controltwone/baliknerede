"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { articles } from "./data"
import { BlogCardSkeleton } from "@/components/LoadingSkeleton"

export default function BlogPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    // Simulate loading time for demo
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="relative min-h-screen page-content">
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

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div 
          className="mb-12 text-center"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-5xl">🎣</span>
            <h1 className="text-4xl md:text-5xl font-bold dark:text-white">Balık Rehberi</h1>
          </div>
          <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Balık türleri, av teknikleri, mevsimsel rehberler ve uzman ipuçları
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto custom-scrollbar">
          {isLoading ? (
            <>
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </>
          ) : (
            articles.map((a, index) => (
            <Link
              key={a.id}
              href={`/blog/${a.id}`}
              className="group block rounded-xl border bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 overflow-hidden"
              style={{ 
                transform: `translateY(${scrollY * (0.02 + index * 0.005)}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="text-xl font-bold group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors leading-tight flex-1">{a.title}</h2>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform text-xl flex-shrink-0">🎣</span>
                </div>
                <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">{a.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {a.tags.map((t) => (
                    <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-muted-foreground dark:text-gray-500">Balık Rehberi</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    Devamını Oku →
                  </span>
                </div>
              </div>
            </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

