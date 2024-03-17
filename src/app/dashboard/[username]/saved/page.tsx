import PostsGrid from '@/components/PostGrid'
import { fetchSavedPostsByEmail } from '@/lib/data'

async function SavedPosts({
  params: { email },
}: {
  params: { email: string }
}) {
  const savedPosts = await fetchSavedPostsByEmail(email)
  const posts = savedPosts?.map((savedPost) => savedPost.post)

  return <PostsGrid posts={posts} />
}

export default SavedPosts
