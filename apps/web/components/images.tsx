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
    <div className='m-4 h-[315px] w-[660px] overflow-hidden rounded-2xl bg-blue-200 bg-transparent p-0 transition-all duration-300 hover:scale-[1.03]'>
      <div className='backdrop-blur-15 backdrop-saturate-86 -mt-2.5 w-full bg-[#f8f8fcd9] pb-px pt-2.5'>
        <div className='m-2.5 px-4 py-2'>
          <div className='flex items-center gap-2'>
            <PhotosIcon />
            <div>
              <p className='text-xl font-medium leading-6'>Photos</p>
              <p className='text-sm text-gray-500'>{count} Photos</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full flex-shrink-0 flex-wrap bg-gray-100'>
        {images.map((img) => (
          <div key={img.id} className='h-[117px] w-[162px] overflow-hidden'>
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
