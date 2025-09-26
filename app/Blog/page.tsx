"use client"
import React from "react"
import Link from "next/link"
import { articles } from "./data"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="text-muted-foreground">Balık türleri, ipuçları ve ekipman önerileri</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/blog/${a.id}`}
            className="group block rounded-xl border bg-white/80 p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold group-hover:text-blue-600">{a.title}</h2>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">🎣</span>
            </div>
            <p className="text-sm text-muted-foreground">{a.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

