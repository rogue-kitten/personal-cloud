'use client';

import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import Image from 'next/image';
import Grid from './grid';
import IcoWrapper from './iconWrapper';

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
    <Grid
      headerIcon={
        <IcoWrapper imageSrc='https://www.icloud.com/system/icloud.com/2420Hotfix12/3d9f23365cbc27cd1ac7f1acc1b3f087.png' />
      }
      headerText='Photos'
      headerSubtext={`${count} photos`}
      cardContent={
        <>
          {count > 0 ? (
            images.map((img) => (
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
            ))
          ) : (
            <div className='relative h-full w-full bg-gray-100 text-gray-500'>
              <div className='absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 text-center'>
                <p>0 photos</p>
              </div>
            </div>
          )}
        </>
      }
    />
  );
}

export default Images;
