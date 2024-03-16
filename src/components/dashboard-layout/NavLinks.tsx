'use client'

import {
  Clapperboard,
  Cog,
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
} from 'lucide-react'
import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'

const links = [
  { name: 'Home', href: '/dashboard', icon: Home },
  {
    name: 'Search',
    href: '/dashboard/search',
    icon: Search,
    hideOnMobile: true,
  },
  { name: 'Explore', href: '/dashboard/explore', icon: Compass },
  {
    name: 'Reels',
    href: '/dashboard/reels',
    icon: Clapperboard,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageCircle,
  },
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: Heart,
    hideOnMobile: true,
  },
  {
    name: 'Create',
    href: '/dashboard/create',
    icon: PlusSquare,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Cog,
  },
]

function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon
        const isActive = pathname === link.href

        return (
          <Link
            key={link.name}
            href={link.href}
            className={buttonVariants({
              variant: isActive ? 'secondary' : 'ghost',
              className: cn('navLink', { 'hidden md:flex': link.hideOnMobile }),
              size: 'lg',
            })}
          >
            <LinkIcon className="w-6" />
            <p
              className={`${cn('hidden lg:block', {
                'font-extrabold': isActive,
              })}`}
            >
              {link.name}
            </p>
          </Link>
        )
      })}
    </>
  )
}

export default NavLinks
