'use server'

import { db } from '@/lib/db'
import { getUserId } from '@/lib/utils'
import {
  BookmarkSchema,
  CreateCommentSchema,
  CreatePostSchema,
  DeleteCommentSchema,
  DeletePostSchema,
  LikeSchema,
  UpdatePostSchema,
} from '@/schemas/posts'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as z from 'zod'

export const createPost = async (values: z.infer<typeof CreatePostSchema>) => {
  const userId = await getUserId()

  const validatedFields = CreatePostSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Post.',
    }
  }

  const { fileUrl, caption } = validatedFields.data

  try {
    await db.post.create({
      data: {
        caption,
        fileUrl,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })

    return { success: 'Successfully created post' }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Post.',
    }
  }
}

export async function deletePost(formData: FormData) {
  const userId = await getUserId()

  const { id } = DeletePostSchema.parse({
    id: formData.get('id'),
  })

  const post = await db.post.findUnique({
    where: {
      id,
      userId,
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  try {
    await db.post.delete({
      where: {
        id,
      },
    })
    revalidatePath('/dashboard')
    return { message: 'Deleted Post.' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Post.' }
  }
}

export async function likePost(value: FormDataEntryValue | null) {
  const userId = await getUserId()

  const validatedFields = LikeSchema.safeParse({ postId: value })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Like Post.',
    }
  }

  const { postId } = validatedFields.data

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  const like = await db.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  })

  if (like) {
    try {
      await db.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })
      revalidatePath('/dashboard')
      return { message: 'Unliked Post.' }
    } catch (error) {
      return { message: 'Database Error: Failed to Unlike Post.' }
    }
  }

  try {
    await db.like.create({
      data: {
        postId,
        userId,
      },
    })
    revalidatePath('/dashboard')
    return { message: 'Liked Post.' }
  } catch (error) {
    return { message: 'Database Error: Failed to Like Post.' }
  }
}

export async function bookmarkPost(value: FormDataEntryValue | null) {
  const userId = await getUserId()

  const validatedFields = BookmarkSchema.safeParse({ postId: value })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Bookmark Post.',
    }
  }

  const { postId } = validatedFields.data

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Error('Post not found.')
  }

  const bookmark = await db.savedPost.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  })

  if (bookmark) {
    try {
      await db.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })
      revalidatePath('/dashboard')
      return { message: 'Unbookmarked Post.' }
    } catch (error) {
      return {
        message: 'Database Error: Failed to Unbookmark Post.',
      }
    }
  }

  try {
    await db.savedPost.create({
      data: {
        postId,
        userId,
      },
    })
    revalidatePath('/dashboard')
    return { message: 'Bookmarked Post.' }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Bookmark Post.',
    }
  }
}

export async function createComment(
  values: z.infer<typeof CreateCommentSchema>
) {
  const userId = await getUserId()

  const validatedFields = CreateCommentSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Missing Fields. Failed to Create Comment.' }
  }

  const { postId, body } = validatedFields.data

  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  try {
    await db.comment.create({
      data: {
        body,
        postId,
        userId,
      },
    })
    revalidatePath('/dashboard')
    return { success: 'Comment created' }
  } catch (error) {
    return { message: 'Database Error: Failed to Create Comment.' }
  }
}

export async function deleteComment(formData: FormData) {
  const userId = await getUserId()

  const { id } = DeleteCommentSchema.parse({
    id: formData.get('id'),
  })

  const comment = await db.comment.findUnique({
    where: {
      id,
      userId,
    },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  try {
    await db.comment.delete({
      where: {
        id,
      },
    })
    revalidatePath('/dashboard')
    return { message: 'Deleted Comment.' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Comment.' }
  }
}

export async function updatePost(values: z.infer<typeof UpdatePostSchema>) {
  const userId = await getUserId()

  const validatedFields = UpdatePostSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Post.',
    }
  }

  const { id, fileUrl, caption } = validatedFields.data

  const post = await db.post.findUnique({
    where: {
      id,
      userId,
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  try {
    await db.post.update({
      where: {
        id,
      },
      data: {
        fileUrl,
        caption,
      },
    })
  } catch (error) {
    return { message: 'Database Error: Failed to Update Post.' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
