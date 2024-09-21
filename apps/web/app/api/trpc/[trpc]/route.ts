import { appRouter } from '@/server/api';
import { createTRPCContext } from '@/server/api/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { cookies, headers } from 'next/headers';

const handler = (request: Request) => {
  if (request.method === 'OPTIONS') {
    const res = new Response(null, { status: 200 });
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Request-Method', '*');
    res.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.headers.set('Access-Control-Allow-Headers', '*');
    return res;
  }

  // console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        headers: headers(),
        cookies: cookies(),
      }),
  });
};

export { handler as GET, handler as POST };
