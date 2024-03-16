import Posts from '@/components/Posts'
import { PostsSkeleton } from '@/components/Skeletons'
import { Suspense } from 'react'

function DashboardPage() {
  return (
    <main className="flex w-full flex-grow">
      <div className="mx-auto flex max-w-lg flex-1 flex-col gap-y-8 pb-20">
        <Suspense fallback={<PostsSkeleton />}>
          <Posts />
        </Suspense>
      </div>
    </main>
  )
}

export default DashboardPage
