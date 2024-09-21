'use client';

import Spinner from '@/components/icons/spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { trpc } from '@/utils/trpc';
import { uploadFiles } from '@/utils/uploadThing-helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const uploadFileSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(0, { message: 'Name cannot be empty' }),

  file: z.instanceof(File),
});

function Home() {
  const form = useForm<z.TypeOf<typeof uploadFileSchema>>({
    resolver: zodResolver(uploadFileSchema),
  });

  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const { mutate, isLoading } = trpc.user.editUserDetails.useMutation({
    onSuccess: () => {
      router.replace('/');
    },
  });

  const onSubmit = async (val: z.TypeOf<typeof uploadFileSchema>) => {
    try {
      setLoader(true);
      if (val.file) {
        const resp = await uploadFiles('vanillaUploader', {
          files: [val.file],
        });

        mutate({ name: val.name, image: resp?.[0]?.key });
      } else {
        mutate({ name: val.name });
      }
    } catch (error) {
      console.log('some error occured', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <main className='flex h-screen min-w-full items-center justify-center'>
      <div className='rounded-xl px-4 py-8 shadow-lg'>
        <p className='text-xl font-semibold'>Register to Personal Cloud</p>
        <div className='py-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='file'
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='file'
                        accept='image/*'
                        onChange={(event) => {
                          const file = event?.target?.files?.[0];
                          console.log('Selected file:', file);

                          if (file) {
                            form.setValue('file', file); // Set the file in the form state
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isLoading || loader}>
                {loader || isLoading ? <Spinner /> : 'Submit'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default Home;
