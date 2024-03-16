import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import Logo from '../dashboard-layout/Logo'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})

type HeaderProps = {
  label: string
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-1">
      <h1 className={cn('text-3xl font-semibold', font.className)}>
        🔐 <Logo />
      </h1>
      <p className="mb-9 text-sm font-semibold text-primary">{label}</p>
    </div>
  )
}
