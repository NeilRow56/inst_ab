import { cn } from '@/lib/utils'

function ViewPost({ className }: { className?: string }) {
  return (
    <div className={cn('flex p-3', className)}>
      <button
        onClick={() => window.location.reload()}
        className="text-sm font-semibold text-sky-500 hover:text-sky-700"
      >
        View post
      </button>
    </div>
  )
}

export default ViewPost
