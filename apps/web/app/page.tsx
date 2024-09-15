import { auth } from '@/auth';
import ListNotes from '@/components/list-notes';
import ListUsers from '@/components/list-user';
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
    helpers.user.getUsers.prefetch({ limit: 10, page: 1 }),
    helpers.notes.getNotesForUser.prefetch({ all: false }),
  ]);

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main style={{ maxWidth: 1200, marginInline: 'auto', padding: 20 }}>
        <p>{JSON.stringify(session, null, 2)}</p>
        <ListUsers />
        <ListNotes />
      </main>
    </Hydrate>
  );
}
