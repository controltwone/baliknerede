import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex items-center justify-between px-4 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} baliknerede</p>
        <nav className="flex items-center gap-4">
          <Link href="/blog">Blog</Link>
          <Link href="/">Akış</Link>
          <span className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <Link href="/gizlilik">Gizlilik</Link>
          <Link href="/cerezler">Çerezler</Link>
          <Link href="/aydinlatma-metni">Aydınlatma Metni</Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer


