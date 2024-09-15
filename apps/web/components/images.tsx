'use client';

import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import Image from 'next/image';
import PhotosIcon from './icons/photos';

function Images() {
  const { data } = trpc.files.getFiles.useQuery({
    limit: 8,
    page: 1,
    fileType: 'image',
  });

  if (!data || data instanceof TRPCError) {
    return <>error</>;
  }

  const count = data.data.count;
  const images = data.data.files;

  return (
    <div className='h-[315px] w-[660px] p-0 overflow-hidden rounded-xl m-4 bg-blue-200 hover:scale-[1.03] transition-all duration-300'>
      <div className='bg-gray-200 -mt-2.5 pt-2.5 pb-px w-full'>
        <div className='px-4 py-2 m-2.5'>
          <div className='flex items-center gap-2'>
            <PhotosIcon />
            <div>
              <p className='font-medium leading-6 text-xl'>Photos</p>
              <p className='text-sm text-gray-500'>{count} Photos</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full flex-wrap flex-shrink-0'>
        {images.map((img) => (
          <div key={img.id} className='w-[162px] overflow-hidden h-[117px]'>
            <Image
              src={img.fileId}
              alt={img.fileName}
              key={img.id}
              width={165}
              height={117}
              className='object-cover'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Images;
