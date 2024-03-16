import { z } from 'zod'

export const PostSchema = z.object({
  id: z.string(),
  fileUrl: z.string().url(),
  caption: z.string().optional(),
})

export const CreatePostSchema = PostSchema.omit({ id: true })
export const UpdatePostSchema = PostSchema
export const DeletePostSchema = PostSchema.pick({ id: true })

export type CreatePostValues = z.infer<typeof CreatePostSchema>
export type UpdatePostValues = z.infer<typeof UpdatePostSchema>
export type DeletePostValues = z.infer<typeof DeletePostSchema>

export const LikeSchema = z.object({
  postId: z.string(),
})

export const BookmarkSchema = z.object({
  postId: z.string(),
})

export const CommentSchema = z.object({
  id: z.string(),
  body: z.string().min(1, {
    message: 'Minimum 1 character required',
  }),
  postId: z.string(),
})

export const CreateCommentSchema = CommentSchema.omit({ id: true })
export const UpdateCommentSchema = CommentSchema
export const DeleteCommentSchema = CommentSchema.pick({ id: true })
