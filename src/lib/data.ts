import { db } from './db'

export async function fetchPosts() {
  // equivalent to doing fetch, cache: no-store

  try {
    const data = await db.post.findMany({
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch posts')
  }
}

export async function fetchPostById(id: string) {
  try {
    const data = await db.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
    })

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch post')
  }
}

export async function fetchPostsByUsername(firstName: string, postId?: string) {
  try {
    const data = await db.post.findMany({
      where: {
        user: {
          firstName,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch posts')
  }
}
