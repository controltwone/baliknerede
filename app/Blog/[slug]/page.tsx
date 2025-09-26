import React from "react"
import Link from "next/link"
import { articles } from "../data"

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.id }))
}

export default async function BlogDetailPage({ params }: Props) {
  const slug = params.slug
  const meta = articles.find((a) => a.id === slug)

  let MDXContent: React.ComponentType | null = null
  try {
    // Dynamic import of MDX component compiled by @next/mdx
    const mod = await import(`../../../content/blog/${slug}.mdx`)
    MDXContent = (mod as any).default || null
  } catch (e) {
    MDXContent = null
  }

  if (!MDXContent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">Yazı bulunamadı.</p>
        <Link className="mt-3 inline-block rounded-md border px-3 py-1" href="/blog">Blog'a dön</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {meta ? (
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">{meta.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
      ) : null}
      <article className="prose max-w-none">
        <MDXContent />
      </article>
    </div>
  )
}


