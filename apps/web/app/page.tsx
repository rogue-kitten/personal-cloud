import { auth } from '@/auth';
import Images from '@/components/images';
import UserDetails from '@/components/user-details';
import Hydrate from '@/utils/hydrate-client';
import { createSSRHelper } from '@/utils/ssrHelper';
import { dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function Home() {
  const helpers = await createSSRHelper();

  const session = await auth();
  if (!session || !session.user) {
    // navigate to the login page
    redirect('/api/auth/signin');
  }

  await Promise.all([
    helpers.user.getUserDetails.prefetch(),
    helpers.files.getFiles.prefetch({ fileType: 'image', page: 1, limit: 8 }),
  ]);

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='h-screen w-screen bg-[url(https://www.icloud.com/system/icloud.com/current/wallpaper.webp)] bg-cover bg-center bg-no-repeat'>
        <div className='mx-auto flex max-w-5xl py-10'>
          <UserDetails />
          <Images />
        </div>
      </main>
    </Hydrate>
  );
}
