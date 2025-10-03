import React from "react"
import Link from "next/link"
import { articles } from "../data"
import matter from "gray-matter"
import fs from "fs"
import path from "path"
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.id }))
}

export default async function BlogDetailPage({ params }: Props) {
  const slug = params.slug
  const meta = articles.find((a) => a.id === slug)

  // Read and parse MDX file with frontmatter
  let frontmatter: any = {}
  let content = ""
  
  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content: mdxContent } = matter(fileContent)
    frontmatter = data
    content = mdxContent
  } catch (e) {
    console.error('Error reading MDX file:', e)
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">Yazı bulunamadı.</p>
        <Link className="mt-3 inline-block rounded-md border px-3 py-1" href="/blog">Blog'a dön</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">🎣</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Balık Rehberi</span>
            </div>
            {(frontmatter.title || meta) && (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {frontmatter.title || meta?.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {frontmatter.summary || meta?.summary}
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {(frontmatter.tags || meta?.tags || []).map((t: string) => (
                    <span key={t} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-8 md:p-12">
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRemote 
                  source={content} 
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                />
              </article>
            </div>
          </div>
          
          {/* Back to Blog Button */}
          <div className="mt-12 text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Blog'a Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


