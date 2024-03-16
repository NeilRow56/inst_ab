'use client'

import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'

const SigninButton = () => {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-2">
      {session && session.user ? (
        <>
          <p className="text-xl text-primary">
            <Link
              href={'/profile'}
            >{`${session.user.firstName} ${session.user.lastName}`}</Link>
          </p>

          <Link
            className="text-xl text-sky-500 transition-colors hover:text-sky-600"
            href={'/api/auth/signout'}
          >
            Sign Out
          </Link>
        </>
      ) : (
        <div className="flex flex-col space-y-6">
          <p>Already Have an account?</p>
          <Button onClick={() => signIn()}>Sign In</Button>
          <p>Create an account?</p>
          <Button
            asChild
            variant="outline"
            className="bg-slate-200 text-primary"
          >
            <Link href={'/auth/sign-up'}>Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default SigninButton
