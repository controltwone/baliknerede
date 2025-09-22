import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Search, User } from 'lucide-react'
import { Menu } from '@headlessui/react'

function header() {
  return (
    <div className='bg-amber-300 shadow-sm top-0'>
        <div className='container mx-auto flex items-center justify-between px-4 py-3'>
            <Link href={"/"}>
             <Image
                src="/logo.png"
                width={30}
                height={30}
                alt="fishing logo"
                />
            </Link>

            <nav className='hidden md:flex space-x-6'>
                <Link href={"/flow"}>Flow</Link>
                <Link href={"/blog"}>Blog</Link>
            </nav>
            <div>
                <Link href={"/login"}>Login</Link>
                <Button variant={'secondary'}>
                    <Search></Search>
                </Button>
                
            </div>
               
        </div>
    </div>
  )
}

export default header