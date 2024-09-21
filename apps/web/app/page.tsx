import { auth } from '@/auth';
import Files from '@/components/files';
import Images from '@/components/images';
import Notes from '@/components/notes';
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
    helpers.files.getFiles.prefetch({
      fileType: 'document',
      page: 1,
      limit: 6,
    }),
    helpers.notes.getNotesForUser.prefetch({}),
  ]);

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main className='min-h-screen w-full bg-[url(https://www.icloud.com/system/icloud.com/current/wallpaper.webp)] bg-cover bg-center bg-no-repeat'>
        <div className='mx-auto flex max-w-[350px] flex-wrap py-24 md:max-w-[700px] lg:max-w-6xl'>
          <UserDetails />
          <Images />
          <Files />
          <Notes />
        </div>
      </main>
    </Hydrate>
  );
}
