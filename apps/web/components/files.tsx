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
import { fromMime } from 'human-filetypes';
import { DownloadIcon, EllipsisIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import Grid from './grid';
import IconWrapper from './iconWrapper';
import PdfIcon from './icons/pdf';
import Spinner from './icons/spinner';
import UploadButton from './uploadButton';

function Files() {
  const windowSize = useWindowWidth();

  const { data } = trpc.files.getFiles.useQuery({
    limit: windowSize > 1024 ? 6 : 3,
    page: 1,
    fileType: 'document',
  });

  const {
    mutateAsync: deleteFile,
    // data: deleteData,
    isLoading: isDeleting,
  } = trpc.files.deleteFile.useMutation({
    onSuccess: () => {
      utils.files.getFiles.invalidate();
    },
  });

  const utils = trpc.useUtils();

  if (!data || data instanceof TRPCError) {
    return <>error</>;
  }

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
                  className='group relative col-span-2 row-span-1 flex items-center gap-4 rounded-md p-2.5 transition-all duration-300 hover:bg-hover_grey lg:col-span-1'
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
                  <div className='absolute inset-0'>
                    <DropdownMenu>
                      <DropdownMenuTrigger className='absolute right-2 top-2 max-h-[12px] w-[23px] rounded-full bg-hover_grey opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                        <EllipsisIcon className='h-[12px] w-[23px] text-black' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            const deletePromise = deleteFile({ id: file.id });

                            toast.promise(deletePromise, {
                              loading: 'Deleting...',
                              success: 'File deleted successfully',
                              error: 'Error occured while deleting the file',
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
                              fileName: file.fileName,
                              fileURL: `https://utfs.io/f/${file.fileId}`,
                            });
                            toast.promise(downloadPromise, {
                              loading: 'Downloading ....',
                              success: 'File downloaded successfully',
                              error: 'Error occured while downloading the file',
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
