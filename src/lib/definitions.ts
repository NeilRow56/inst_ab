import type { Comment, Like, Post, SavedPost, User } from '@prisma/client'

export type CommentWithExtras = Comment & { user: User }
export type LikeWithExtras = Like & { user: User }

export type PostWithExtras = Post & {
  comments: CommentWithExtras[]
  likes: LikeWithExtras[]
  savedBy: SavedPost[]
  user: User
}

export type UserWithExtras = User & {
  posts: Post[]
  saved: SavedPost[]
}
