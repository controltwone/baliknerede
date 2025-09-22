"use client"

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bell, Search } from 'lucide-react'
import { Menu } from '@headlessui/react'
import { useAuth } from './AuthProvider'

function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  return (
    <div className="bg-amber-300 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" width={32} height={32} alt="fishing logo" />
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
          <Link href="/">
            <Button>
              Akış
            </Button>
          </Link>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Ara: balık noktası, kullanıcı, etiket..." />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="secondary" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button as={Button} variant="secondary" className="px-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || ''} />
                  <AvatarFallback>{(user?.name || 'BN').slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{isAuthenticated ? user?.name : 'Hesabım'}</span>
              </div>
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border bg-popover p-1 shadow-md focus:outline-none">
              {isAuthenticated ? (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${active ? 'bg-accent' : ''} block rounded-sm px-3 py-2`}
                      >
                        Profil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${active ? 'bg-accent' : ''} block w-full rounded-sm px-3 py-2 text-left`}
                      >
                        Çıkış Yap
                      </button>
                    )}
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/login"
                        className={`${active ? 'bg-accent' : ''} block rounded-sm px-3 py-2`}
                      >
                        Giriş Yap
                      </Link>
                    )}
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default Header