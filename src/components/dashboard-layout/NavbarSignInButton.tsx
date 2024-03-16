'use client'

import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { UserNav } from './UserNav'

const NavbarSigninButton = () => {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-1">
      {session && session.user ? (
        <>
          <UserNav
            name={session.user.firstName}
            email={session.user.email}
            imageUrl={session.user.imageUrl}
          />
        </>
      ) : (
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href={'/auth/sign-in'}>Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={'/auth/sign-up'}>Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default NavbarSigninButton
