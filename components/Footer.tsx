import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-transparent to-gray-50/80 dark:to-gray-900/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <img src="/logo.png" alt="baliknerede" className="h-8 w-8 rounded" />
              <span className="text-base font-semibold tracking-wide text-gray-900 dark:text-white">baliknerede</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              İstanbul ve kıyı şehirlerindeki balık avı paylaşımları, anlık konum ve tür filtreleriyle.
            </p>
          </div>

          {/* Site */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Site</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Akış</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Hukuki */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hukuki</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/gizlilik" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Gizlilik</Link>
              </li>
              <li>
                <Link href="/cerezler" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Çerezler</Link>
              </li>
              <li>
                <Link href="/aydinlatma-metni" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Aydınlatma Metni</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200/70 dark:border-gray-800/70 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} baliknerede</p>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gray-200/60 px-2 py-1 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">TR</span>
              <span className="h-3 w-px bg-gray-300 dark:bg-gray-700" />
              <span className="text-[11px]">Sürüm 1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


