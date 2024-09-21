'use client';

import { trpc } from '@/utils/trpc';
import { TRPCError } from '@trpc/server';
import Image from 'next/image';
import ProfileBackground from './profileBackground';

function UserDetails() {
  const { data } = trpc.user.getUserDetails.useQuery();

  if (!data || data instanceof TRPCError) {
    return <>error occured</>;
  }

  const user = data.data.user;

  return (
    <div className='relative m-4 flex h-[315px] w-[315px] flex-col rounded-2xl bg-profile-gradient p-8 backdrop-blur-15 backdrop-saturate-86 transition-all duration-300 hover:scale-[1.03]'>
      <ProfileBackground />
      <Image
        src={
          user.image
            ? `https://utfs.io/f/${user.image}`
            : 'https://utfs.io/f/dXm0bGnwXpjOInC5kicaRK5MSGTmkgqXPpOdAUeB78N0EDrc'
        }
        alt='profile'
        className='h-[114px] w-[114px] rounded-full object-center'
        width={114}
        height={114}
      />
      <div className='mb-5 mt-auto flex flex-col gap-5'>
        <p className='text-3xl font-semibold'>{user.name}</p>
        <p className='font-semibold'>iCloud</p>
      </div>
    </div>
  );
}

export default UserDetails;
