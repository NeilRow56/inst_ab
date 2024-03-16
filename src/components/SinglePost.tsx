import Comment from '@/components/Comment'
import CommentForm from '@/components/CommentForm'
import Post from '@/components/Post'
import PostActions from '@/components/PostActions'
import PostOptions from '@/components/PostOptions'
import UserAvatar from '@/components/UserAvatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchPostById } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from './ui/card'
import MiniPost from './MiniPost'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function SinglePost({ id }: { id: string }) {
  const post = await fetchPostById(id)
  const session = await getServerSession(authOptions)
  const postUsername = post?.user.firstName
  const userId = session?.user.id

  if (!post) {
    notFound()
  }

  return (
    <>
      <Card className="mx-auto hidden max-w-3xl md:flex lg:max-w-4xl">
        <div className="relative h-[450px] w-full max-w-sm overflow-hidden lg:max-w-lg">
          <Image
            src={post.fileUrl}
            alt="Post preview"
            fill
            className="object-cover md:rounded-l-md"
          />
        </div>

        <div className="flex max-w-sm flex-1 flex-col">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  className="text-sm font-semibold"
                  href={`/dashboard/${postUsername}`}
                >
                  {postUsername}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={post.user} className="h-14 w-14" />
                  <div>
                    <p className="font-bold">{postUsername}</p>
                    <p className="text-sm font-medium dark:text-neutral-400">
                      {post.user.firstName}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <PostOptions post={post} userId={userId} />
          </div>

          {post.comments.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
              <p className="text-xl font-extrabold lg:text-2xl">
                No comments yet.
              </p>
              <p className="text-sm font-medium">Start the conversation.</p>
            </div>
          )}

          {post.comments.length > 0 && (
            <ScrollArea className="hidden flex-1 py-1.5 md:inline">
              <MiniPost post={post} />
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </ScrollArea>
          )}

          <div className="mt-auto hidden border-y p-2.5 px-2 md:block">
            <PostActions post={post} userId={userId} />
            <time className="text-[11px] font-medium uppercase text-zinc-500">
              {new Date(post.createdAt).toLocaleDateString('en-GB', {
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <CommentForm postId={id} className="hidden md:inline-flex" />
        </div>
      </Card>
      <div className="md:hidden">
        <Post post={post} />
      </div>
    </>
  )
}

export default SinglePost
