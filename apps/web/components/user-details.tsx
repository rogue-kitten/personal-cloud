'use client';

import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import Image from 'next/image';

function UserDetails() {
  const { data } = trpc.user.getUserDetails.useQuery();

  if (!data || data instanceof TRPCError) {
    return <>error occured</>;
  }

  const user = data.data.user;

  return (
    <div className='h-[315px] w-[315px] rounded-xl m-4 p-8 flex flex-col bg-blue-200 hover:scale-[1.03] transition-all duration-300'>
      <Image
        src={
          user.image ??
          'https://utfs.io/f/dXm0bGnwXpjOInC5kicaRK5MSGTmkgqXPpOdAUeB78N0EDrc'
        }
        alt='profile'
        className='rounded-full'
        width={95}
        height={95}
      />
      <div className='mt-auto flex flex-col gap-5 mb-5'>
        <p className='font-semibold text-3xl'>{user.name}</p>
        <p className='font-semibold'>iCloud</p>
      </div>
    </div>
  );
}

export default UserDetails;
