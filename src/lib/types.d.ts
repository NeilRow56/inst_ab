import { User } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: User
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      username?: string | null
    }
  }

  interface User {
    username?: string | null
  }
}
