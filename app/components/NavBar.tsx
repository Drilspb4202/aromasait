'use client'

import { Button } from '@/components/ui/button'
import { Menu, Home } from 'lucide-react'
import Link from 'next/link'

interface NavBarProps {
  onOpenSideNav: () => void
}

const NavBar = ({ onOpenSideNav }: NavBarProps) => {
  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">АВБ</span>
          </div>
          <div className="flex items-center">
            <Link href="/" passHref>
              <Button variant="ghost" className="mr-2">
                <Home className="h-5 w-5 mr-2" />
                На главную
              </Button>
            </Link>
            <Button variant="ghost" onClick={onOpenSideNav}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar

