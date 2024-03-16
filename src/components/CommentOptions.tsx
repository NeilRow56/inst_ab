'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Comment } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { TrashDelete } from './dashboard-layout/SubmitButtons'
import { deleteComment } from '@/actions/post-actions'

type Props = {
  comment: Comment
}

function CommentOptions({ comment }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal className="hidden h-5 w-5 cursor-pointer group-hover:inline dark:text-neutral-400" />
      </DialogTrigger>
      <DialogContent className="dialogContent">
        <form
          action={async (formData) => {
            const { message } = await deleteComment(formData)
            toast(message)
          }}
          className="postOption"
        >
          <input type="hidden" name="id" value={comment.id} />
          <TrashDelete />
        </form>

        <DialogClose className="postOption w-full border-0 p-3">
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default CommentOptions
