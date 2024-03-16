import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@prisma/client'
import type { AvatarProps } from '@radix-ui/react-avatar'

type Props = Partial<AvatarProps> & {
  user: User | undefined
}

function UserAvatar({ user, ...avatarProps }: Props) {
  return (
    <Avatar className="h-10 w-10 rounded-full">
      <AvatarImage src="/profile.jpg" alt="profile image" />
      <AvatarFallback>Jan</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
