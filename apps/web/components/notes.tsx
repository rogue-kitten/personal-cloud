'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import {
  CirclePlus,
  DownloadIcon,
  EllipsisIcon,
  TrashIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Grid from './grid';
import Spinner from './icons/spinner';
import IconWrapper from './iconWrapper';
import NotesDialogue from './notesDialogue';

function Notes() {
  const { data } = trpc.notes.getNotesForUser.useQuery({});

  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteNote,
    data: deleteData,
    isLoading: isDeleting,
  } = trpc.notes.deleteNote.useMutation();

  useEffect(() => {
    if (deleteData && !isDeleting) {
      utils.notes.getNotesForUser.invalidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleting]);

  if (!data || data instanceof TRPCError) {
    return <>error</>;
  }

  const notes = data.data.notes;

  return (
    <Grid
      size='small'
      headerText='Notes'
      optionIcon={<NotesDialogue trigger={<CirclePlus />} />}
      cardContent={
        <div className='grid h-full w-full grid-cols-1 grid-rows-3 bg-white p-2.5'>
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className='group relative rounded-md py-2.5 pl-5 pr-2.5 transition-all duration-300 hover:bg-hover_grey'
              >
                <div className='flex flex-col gap-1'>
                  <p className='text-sm text-black/80'>{note.title}</p>
                  <div className='overflow-hidden'>
                    <p className='flex gap-2 truncate text-nowrap text-xs'>
                      <span className='text-black/80'>
                        {format(new Date(note.updatedAt), 'dd/MM/yy')}
                      </span>
                      <span className='text-black/50'>{note.note}</span>
                    </p>
                  </div>
                </div>
                <div className='absolute inset-0'>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='absolute right-2 top-2 max-h-[12px] w-[23px] rounded-full bg-hover_grey opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <EllipsisIcon className='h-[12px] w-[23px] text-black' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => {
                          const deletePromise = deleteNote({ id: note.id });

                          toast.promise(deletePromise, {
                            loading: 'Deleting...',
                            success: 'note  deleted successfully',
                            error: 'Error occured while deleting note',
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
                      <DropdownMenuItem asChild>
                        <NotesDialogue
                          key={note.id}
                          triggerAsChild
                          trigger={
                            <div className='flex w-full select-none items-center justify-between rounded-sm px-2 py-1.5 text-xs text-gray-600 hover:bg-accent hover:text-accent-foreground'>
                              <div>
                                <p>Edit</p>
                              </div>
                              <DownloadIcon className='h-4 w-4' />
                            </div>
                          }
                          id={note.id}
                          defaultValues={{
                            note: note.note,
                            title: note.title,
                          }}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className='relative row-span-3 h-full w-full text-gray-500'>
              <div className='absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 text-center'>
                <p>0 notes</p>
              </div>
            </div>
          )}
        </div>
      }
      headerIcon={
        <IconWrapper
          imageSrc='https://www.icloud.com/system/icloud.com/2420Hotfix12/d54ad91bda4e227aab4fc06c9e23bcc8.png'
          alt='Notes icon'
        />
      }
    />
  );
}

export default Notes;
