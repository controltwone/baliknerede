import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex items-center justify-between px-4 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} baliknerede</p>
        <nav className="flex items-center gap-4">
          <Link href="/blog">Blog</Link>
          <Link href="/flow">Flow</Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer