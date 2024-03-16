import { AuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { db } from '@/lib/db'
import { User } from '.prisma/client'

import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/auth/sign-in',
  },

  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'User Name',
          type: 'text',
          placeholder: 'Your User Name',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      // Below we are using the user's email as their username
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: {
            email: credentials?.username,
          },
        })

        if (!user) throw new Error('User name or password is not correct')

        if (!credentials?.password)
          throw new Error('Please Provide Your Password')
        const isPassowrdCorrect = await bcryptjs.compare(
          credentials.password,
          user.password
        )

        if (!isPassowrdCorrect)
          throw new Error('User name or password is not correct')

        const { password, ...userWithoutPass } = user
        return userWithoutPass
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as User
      return token
    },

    async session({ token, session }) {
      session.user = token.user
      return session
    },
  },
}

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}
