import { Button } from '@/components/ui/button'
import { ArrowBigLeft } from 'lucide-react'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex h-full items-center justify-center bg-slate-100 
          text-center
          dark:bg-slate-800"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          asChild
          className="l-10 absolute top-10 w-[160px] gap-4"
        >
          <Link href="/">
            {' '}
            <ArrowBigLeft />
            Home Page
          </Link>
        </Button>
      </div>
      {children}
    </div>
  )
}

export default AuthLayout
