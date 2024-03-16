'use client'

import { PostWithExtras } from '@/lib/definitions'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { TrashDelete } from './dashboard-layout/SubmitButtons'
import { deletePost } from '@/actions/post-actions'

type Props = {
  post: PostWithExtras
  userId?: string
  className?: string
}

function PostOptions({ post, userId, className }: Props) {
  const isPostMine = post.userId === userId

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal
          className={cn(
            'h-5 w-5 cursor-pointer dark:text-neutral-400',
            className
          )}
        />
      </DialogTrigger>
      <DialogContent className="dialogContent">
        {isPostMine && (
          <form
            action={async (formData) => {
              const { message } = await deletePost(formData)
              toast(message)
            }}
            className="postOption"
          >
            <input type="hidden" name="id" value={post.id} />
            <span className="flex h-12 items-center gap-4">
              Delete
              <TrashDelete />
            </span>
          </form>
        )}

        {isPostMine && (
          <Link
            scroll={false}
            href={`/dashboard/p/${post.id}/edit`}
            className="postOption p-3"
          >
            Edit
          </Link>
        )}

        <form action="" className="postOption border-0">
          <button className="w-full p-3">Hide like count</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PostOptions
