'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useWindowWidth from '@/utils/hooks/useWindowWidth';
import { trpc } from '@/utils/trpc';
import { downloadFileFromURL } from '@/utils/utils';
import { TRPCError } from '@trpc/server';
import { DownloadIcon, EllipsisIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import Grid from './grid';
import Spinner from './icons/spinner';
import IcoWrapper from './iconWrapper';
import UploadButton from './uploadButton';

function Images() {
  const windowSize = useWindowWidth();

  const { data, isLoading } = trpc.files.getFiles.useQuery({
    limit: windowSize > 1024 ? 8 : 4,
    page: 1,
    fileType: 'image',
  });

  const {
    mutateAsync: deleteImage,
    // data: deleteData,
    isLoading: isDeleting,
  } = trpc.files.deleteFile.useMutation({
    onSuccess: () => {
      utils.files.getFiles.invalidate();
    },
  });

  const utils = trpc.useUtils();

  if (isLoading) return <>IsLoading</>;

  if (!data || data instanceof TRPCError) {
    return <>error</>;
  }

  const count = data.data.count;
  const images = data.data.files;

  return (
    <Grid
      headerIcon={
        <IcoWrapper
          alt='Photos Icon'
          imageSrc='https://www.icloud.com/system/icloud.com/2420Hotfix12/3d9f23365cbc27cd1ac7f1acc1b3f087.png'
        />
      }
      headerText='Photos'
      headerSubtext={`${count} photos`}
      optionIcon={
        <UploadButton
          onClientUploadComplete={() => {
            console.log('success log has been done');
            utils.files.getFiles.invalidate();
          }}
          endpoint='imageUploader'
          acceptedFileTypes='image/*'
        />
      }
      cardContent={
        <>
          {count > 0 ? (
            images.map((img) => (
              <div
                key={img.id}
                className='group relative h-[117px] w-[157.5px] overflow-hidden lg:w-[165px]'
              >
                <Image
                  src={`https://utfs.io/f/${img.fileId}`}
                  alt={img.fileName}
                  key={img.id}
                  width={165}
                  height={117}
                  className='h-full w-full object-cover'
                />
                <div className='absolute inset-0'>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='absolute right-2 top-2 max-h-[12px] w-[23px] rounded-full bg-hover_grey opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <EllipsisIcon className='h-[12px] w-[23px] text-black' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => {
                          const deletePromise = deleteImage({ id: img.id });

                          toast.promise(deletePromise, {
                            loading: 'Deleting...',
                            success: 'Image deleted successfully',
                            error: 'Error occured while deleting the image',
                          });
                        }}
                        className='text-xs text-red-500'
                      >
                        Delete
                        <DropdownMenuShortcut>
                          {isDeleting ? (
                            <Spinner className='h-4 w-4' />
                          ) : (
                            <TrashIcon className='h-4 w-4' />
                          )}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          const downloadPromise = downloadFileFromURL({
                            fileName: img.fileName,
                            fileURL: `https://utfs.io/f/${img.fileId}`,
                          });
                          toast.promise(downloadPromise, {
                            loading: 'Downloading ....',
                            success: 'Image downloaded successfully',
                            error: 'Error occured while downloading the image',
                          });
                        }}
                        className='text-xs text-gray-600'
                      >
                        Download
                        <DropdownMenuShortcut>
                          <DownloadIcon className='h-4 w-4' />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
