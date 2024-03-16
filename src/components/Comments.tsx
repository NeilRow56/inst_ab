'use client'

import { CommentWithExtras } from '@/lib/definitions'
import { User } from 'next-auth'
// ts-ignore because experimental_useOptimistic is not in the types
// @ts-ignore
import { experimental_useOptimistic as useOptimistic } from 'react'
import React, { useTransition } from 'react'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreateCommentSchema } from '@/schemas/posts'
import Link from 'next/link'
import { createComment } from '@/actions/post-actions'

export default function Comments({
  postId,
  comments,

  user,
}: {
  postId: string
  comments: CommentWithExtras[]

  user?: User | null
}) {
  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      body: '',
      postId,
    },
  })

  let [isPending, startTransition] = useTransition()
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    CommentWithExtras[]
  >(
    comments,

    (state: Comment[], newComment: string) => [
      { body: newComment, userId: user?.id, postId, user },
      ...state,
    ]
  )
  const body = form.watch('body')
  const commentsCount = optimisticComments.length

  const onSubmit = (values: z.infer<typeof CreateCommentSchema>) => {
    startTransition(() => {
      createComment(values)
        .then((data) => {
          if (data?.error) {
            form.reset()
            toast.error(data.error)
          }

          if (data?.success) {
            form.reset()
            toast.success(data.success)
          }
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  return (
    <div className="space-y-0.5 px-3 sm:px-0">
      {commentsCount > 1 && (
        <Link
          scroll={false}
          href={`/dashboard/p/${postId}`}
          className="text-sm font-medium text-neutral-500"
        >
          View all {commentsCount} comments
        </Link>
      )}
      {/* Types added as a quick fix from error messGE */}
      {optimisticComments.slice(0, 3).map(
        (
          comment: {
            user: { firstName: string }
            body:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | React.PromiseLikeOfReactNode
              | null
              | undefined
          },
          i: React.Key | null | undefined
        ) => {
          const username = comment.user?.firstName

          return (
            <div
              key={i}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <Link
                href={`/dashboard/${username}`}
                className="font-semibold text-primary"
              >
                {username}
              </Link>
              <p>{comment.body}</p>
            </div>
          )
        }
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center space-x-2 border-b border-gray-300 py-1 pb-3 dark:border-neutral-800"
        >
          <FormField
            control={form.control}
            name="body"
            render={({ field, fieldState }) => (
              <FormItem className="flex w-full">
                <FormControl>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    disabled={isPending}
                    className="flex-1 border-none  bg-transparent text-sm font-medium placeholder-neutral-500 focus:outline-none dark:text-white dark:placeholder-neutral-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {body.trim().length > 0 && (
            <button
              type="submit"
              className="text-sm font-semibold text-sky-500 hover:text-white disabled:cursor-not-allowed disabled:hover:text-sky-500"
            >
              Post
            </button>
          )}
        </form>
      </Form>
    </div>
  )
}
