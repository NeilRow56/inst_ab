'use client'

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SingleImageDropzone } from '@/components/forms/SingleImageDropzone'
import { useEdgeStore } from '@/lib/edgestore'
import { toast } from 'sonner'
import { Loader2, XCircle } from 'lucide-react'
import { CreatePostSchema, CreatePostValues } from '@/schemas/posts'
import useMount from '@/hooks/useMount'
import { createPost } from '@/actions/post-actions'

function CreatePage() {
  const pathname = usePathname()
  const isCreatePage = pathname === '/dashboard/create'
  const [file, setFile] = useState<File>()
  const [progress, setProgress] = useState(0)
  const [fileUrl, setFileUrl] = useState<string | undefined>()
  const [imageIsDeleting, setImageIsDeleting] = useState(false)

  const { edgestore } = useEdgeStore()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const mount = useMount()

  const form = useForm<CreatePostValues>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      caption: '',
      fileUrl: undefined,
    },
  })

  useEffect(() => {
    if (typeof fileUrl === 'string') {
      form.setValue('fileUrl', fileUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl])

  const handleImageDelete = async (fileUrl: string) => {
    setImageIsDeleting(true)
    await edgestore.publicFiles.delete({
      url: fileUrl,
    })

    setFileUrl('')
    toast.success('Image deleted')
    setImageIsDeleting(false)
  }

  if (!mount) return null

  const onSubmit = (values: z.infer<typeof CreatePostSchema>) => {
    startTransition(() => {
      createPost(values)
        .then((data) => {
          if (data?.errors) {
            form.reset()
            return toast.error('Something went wrong')
          }

          if (data?.success) {
            form.reset()
            toast.success(data.success)
            router.push('/dashboard')
            router.refresh()
          }
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }
  return (
    <div>
      <Dialog
        open={isCreatePage}
        onOpenChange={(open) => !open && router.back()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new post</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-primary">Upload an Image *</h3>
                    <FormControl>
                      <FormControl>
                        {fileUrl ? (
                          <>
                            <div className="relative mt-4 max-h-[400px] min-h-[200px] min-w-[200px] max-w-[400px]">
                              <Image
                                fill
                                src={fileUrl}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                alt=" Image"
                                className="object-contain"
                              />
                              <Button
                                onClick={() => handleImageDelete(fileUrl)}
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-[-12px] top-0"
                              >
                                {imageIsDeleting ? <Loader2 /> : <XCircle />}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <section className="mx-auto my-8 w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:p-8">
                              <div className=" flex flex-col">
                                <div className="mx-auto">
                                  <SingleImageDropzone
                                    width={200}
                                    height={200}
                                    value={file}
                                    onChange={(file) => {
                                      setFile(file)
                                    }}
                                  />
                                  {progress < 100 && (
                                    <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                      <div
                                        className="rounded-full bg-blue-600 p-0.5 text-center text-xs font-medium leading-none text-blue-100"
                                        style={{ width: '85' }}
                                      >
                                        {' '}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex justify-center">
                                    <button
                                      className="mt-1 rounded-lg bg-blue-500 px-2 py-1 text-gray-50"
                                      onClick={async () => {
                                        if (file) {
                                          const res =
                                            await edgestore.publicFiles.upload({
                                              file,
                                              onProgressChange: (progress) => {
                                                setProgress(progress)
                                              },
                                            })
                                          // you can run some server action or api here
                                          // to add the necessary data to your database
                                          // console.log(res)
                                          setFileUrl(res?.url)
                                          toast.success('Upload Comp[lete')
                                        }
                                      }}
                                    >
                                      Upload
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </>
                        )}
                      </FormControl>
                    </FormControl>
                    <FormDescription>Upload a picture to post.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!!fileUrl && (
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
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" disabled={isPending}>
                Create Post
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreatePage
