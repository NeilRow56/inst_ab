'use client'

import Error from '@/components/Error'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useMount from '@/hooks/useMount'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Post } from '@prisma/client'
import { UpdatePostSchema } from '@/schemas/posts'
import { updatePost } from '@/actions/post-actions'

function EditPost({ id, post }: { id: string; post: Post }) {
  const mount = useMount()
  const pathname = usePathname()
  const isEditPage = pathname === `/dashboard/p/${id}/edit`
  const router = useRouter()
  const form = useForm<z.infer<typeof UpdatePostSchema>>({
    resolver: zodResolver(UpdatePostSchema),
    defaultValues: {
      id: post.id,
      caption: post.caption || '',
      fileUrl: post.fileUrl,
    },
  })
  const fileUrl = form.watch('fileUrl')

  if (!mount) return null

  return (
    <Dialog open={isEditPage} onOpenChange={(open) => !open && router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit info</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              const res = await updatePost(values)

              if (res) {
                return toast.error(<Error res={res} />)
              }
            })}
          >
            <div className="h-96 overflow-hidden rounded-md md:h-[450px]">
              <AspectRatio ratio={1 / 1} className="relative h-full">
                <Image
                  src={fileUrl}
                  alt="Post preview"
                  fill
                  className="rounded-md object-cover"
                />
              </AspectRatio>
            </div>

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="caption">Caption</FormLabel>
                  <FormControl>
                    <Input
                      type="caption"
                      id="caption"
                      placeholder="Write a caption..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Done
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPost
