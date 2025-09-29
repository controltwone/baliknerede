"use client"

import React from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    try {
      const dismissed = localStorage.getItem('cookie_notice_dismissed')
      if (!dismissed) setVisible(true)
    } catch {}
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          Yalnızca zorunlu çerezler kullanıyoruz (oturum ve güvenlik). Ayrıntılar için{' '}
          <Link href="/cerezler" className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400">Çerez Politikası</Link>{' '}
          ve{' '}
          <Link href="/gizlilik" className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400">Gizlilik Politikası</Link> sayfalarına bakabilirsiniz.
        </p>
        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            onClick={() => {
              try { localStorage.setItem('cookie_notice_dismissed', '1') } catch {}
              setVisible(false)
            }}
            className="px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  )
}


