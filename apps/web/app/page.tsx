import { auth } from '@/auth';
import ListUsers from '@/components/list-user';
import Hydrate from '@/utils/hydrate-client';
import { createSSRHelper } from '@/utils/ssrHelper';
import { dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function Home() {
  const helpers = await createSSRHelper();
  await helpers.user.getUsers.prefetch({ limit: 10, page: 1 });

  const session = await auth();

  if (!session) {
    // navigate to the login page
    redirect('/api/auth/signin');
  }

  return (
    <Hydrate state={dehydrate(helpers.queryClient)}>
      <main style={{ maxWidth: 1200, marginInline: 'auto', padding: 20 }}>
        <p>{JSON.stringify(session, null, 2)}</p>
        <ListUsers />
      </main>
    </Hydrate>
  );
}
