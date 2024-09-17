'use client';

import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import Grid from './grid';
import IconWrapper from './iconWrapper';

function Notes() {
  const { data } = trpc.notes.getNotesForUser.useQuery({});

  if (!data || data instanceof TRPCError) {
    return <>error</>;
  }

  const notes = data.data.notes;

  return (
    <Grid
      size='small'
      headerText='Notes'
      cardContent={
        <div className='grid h-full w-full grid-cols-1 grid-rows-3 bg-white p-2.5'>
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className='rounded-md py-2.5 pl-5 pr-2.5 hover:bg-hover_grey'
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
              </div>
            ))
          ) : (
            <div className='relative h-full w-full text-gray-500'>
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
