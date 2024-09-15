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
    <div className='backdrop-blur-15 bg-profile-gradient backdrop-saturate-86 m-4 flex h-[315px] w-[315px] flex-col rounded-2xl p-8 transition-all duration-300 hover:scale-[1.03]'>
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
      <div className='mb-5 mt-auto flex flex-col gap-5'>
        <p className='text-3xl font-semibold'>{user.name}</p>
        <p className='font-semibold'>iCloud</p>
      </div>
    </div>
  );
}

export default UserDetails;
