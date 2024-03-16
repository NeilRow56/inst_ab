import { SinglePostSkeleton } from '@/components/Skeletons'
import { Suspense } from 'react'
import { Separator } from '@/components/ui/separator'

function PostPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <Suspense fallback={<SinglePostSkeleton />}>Single Post</Suspense>

      <Separator className="mx-auto my-12 max-w-3xl lg:max-w-4xl" />

      <Suspense>More Posts</Suspense>
    </div>
  )
}

export default PostPage
