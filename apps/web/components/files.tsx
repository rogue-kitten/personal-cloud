'use client';

import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import { fromMime } from 'human-filetypes';
import Grid from './grid';
import IconWrapper from './iconWrapper';
import PdfIcon from './icons/pdf';
import UploadButton from './uploadButton';

function Files() {
  const { data } = trpc.files.getFiles.useQuery({
    limit: 6,
    page: 1,
    fileType: 'document',
  });

  if (!data || data instanceof TRPCError) {
    return <>error</>;
  }

  const utils = trpc.useUtils();

  const count = data.data.count;
  const files = data.data.files;

  return (
    <Grid
      headerIcon={
        <IconWrapper
          alt='File Icon'
          imageSrc='https://www.icloud.com/system/icloud.com/2420Hotfix12/721bdfc3241b42114d62842854461ae7.png'
        />
      }
      headerText='Drive'
      headerSubtext='Recently Added'
      optionIcon={
        <UploadButton
          onClientUploadComplete={() => {
            console.log('success log has been done');
            utils.files.getFiles.invalidate();
          }}
          endpoint='fileUploader'
        />
      }
      cardContent={
        <>
          {count > 0 ? (
            <div className='grid h-full w-full grid-cols-2 grid-rows-3 bg-white p-2.5'>
              {files.map((file) => (
                <div
                  key={file.id}
                  className='flex items-center gap-4 rounded-md p-2.5 transition-all duration-300 hover:bg-hover_grey'
                >
                  <PdfIcon />
                  <div className='space-y-1 overflow-hidden text-black/80'>
                    <p className='truncate text-nowrap text-sm'>
                      {file.fileName}
                    </p>
                    <p className='text-xs capitalize'>
                      {fromMime(file.mimeType)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='relative h-full w-full bg-gray-100 text-gray-500'>
              <div className='absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 text-center'>
                <p>0 files</p>
              </div>
            </div>
          )}
        </>
      }
    />
  );
}

export default Files;
