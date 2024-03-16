'use client'

import CommentForm from '@/components/CommentForm'
import PostActions from '@/components/PostActions'
import UserAvatar from '@/components/UserAvatar'

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import useMount from '@/hooks/useMount'
import { PostWithExtras } from '@/lib/definitions'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'
import MiniPost from './MiniPost'
import Comment from './Comment'
import ViewPost from './ViewPost'

// import MiniPost from "./MiniPost";

function PostView({ id, post }: { id: string; post: PostWithExtras }) {
  const pathname = usePathname()
  const isPostModal = pathname === `/dashboard/p/${id}`
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user
  const inputRef = useRef<HTMLInputElement>(null)
  const username = post.user.firstName
  const href = `/dashboard/${username}`
  const mount = useMount()

  if (!mount) return null

  return (
    <Dialog open={isPostModal} onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="flex h-full max-h-[500px] flex-col items-start gap-0 p-0 md:max-w-3xl md:flex-row lg:max-h-[700px] lg:max-w-5xl xl:max-h-[800px] xl:max-w-6xl">
        <div className="flex w-full max-w-md flex-col justify-between md:order-2 md:h-full">
          <DialogHeader className="flex flex-row items-center space-x-2.5 space-y-0 border-b py-4 pl-3.5 pr-6">
            <Link href={href}>
              <UserAvatar user={post.user} />
            </Link>
            <Link href={href} className="text-sm font-semibold">
              {username}
            </Link>
          </DialogHeader>

          <ScrollArea className="hidden flex-1 border-b py-1.5 md:inline">
            <MiniPost post={post} />
            {post.comments.length > 0 && (
              <>
                {post.comments.map((comment) => {
                  return (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      inputRef={inputRef}
                    />
                  )
                })}
              </>
            )}
          </ScrollArea>

          <ViewPost className="hidden border-b md:flex" />

          <div className="mt-auto hidden border-b p-2.5 px-2 md:block">
            <PostActions post={post} userId={user?.id} />
            <time className="text-[11px]  font-medium uppercase text-zinc-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <CommentForm
            postId={id}
            className="hidden md:inline-flex"
            inputRef={inputRef}
          />
        </div>

        <div className="relative h-96 w-full max-w-3xl overflow-hidden md:h-[500px] lg:h-[700px] xl:h-[800px]">
          <Image
            src={post.fileUrl}
            fill
            objectFit="cover"
            alt="Post Image"
            className="object-cover md:rounded-l-md"
          />
        </div>

        <PostActions
          post={post}
          userId={user?.id}
          className="border-b p-2.5 md:hidden"
        />
        <CommentForm postId={id} className="md:hidden" inputRef={inputRef} />
        <ViewPost className="md:hidden" />
      </DialogContent>
    </Dialog>
  )
}

export default PostView
