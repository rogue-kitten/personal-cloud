import { appRouter } from '@/server/api';
import { createTRPCContext } from '@/server/api/trpc';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { cookies, headers } from 'next/headers';
import SuperJSON from 'superjson';

export const createSSRHelper = async () => {
  const allHeaders = headers();
  const apiKey = allHeaders.get('x-api-key') || 'foobarbaz';

  return createServerSideHelpers({
    router: appRouter,
    transformer: SuperJSON,
    ctx: await createTRPCContext({
      cookies: cookies(),
      headers: new Headers({
        ...Object.fromEntries(allHeaders.entries()),
        'x-api-key': apiKey,
      }),
    }),
  });
};
