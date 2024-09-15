'use client';

import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import { UploadButton } from './uploadthing';

function ListNotes() {
  const { data } = trpc.notes.getNotesForUser.useQuery({ all: false });

  if (data instanceof TRPCError) {
    return <div>Error while getting the user</div>;
  }

  return (
    <>
      <div>
        {data?.data.notes.length === 0 ? (
          <div>No notes found for this user</div>
        ) : (
          <div>{JSON.stringify(data?.data.notes, null, 2)}</div>
        )}
      </div>
      <UploadButton
        endpoint='fileUploader'
        onClientUploadComplete={(res) => {
          console.log('Files: ', res);
          alert('Upload Completed');
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
}

export default ListNotes;
