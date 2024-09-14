import { appRouter } from '@/server/api';
import { createTRPCContext } from '@/server/api/trpc';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { createOpenApiFetchHandler } from 'trpc-swagger';

const handler = (req: Request) => {
  // Handle incoming swagger/openapi requests
  return createOpenApiFetchHandler({
    req,
    endpoint: '/api',
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        cookies: {} as ReadonlyRequestCookies,
      }),
  });
};
export { handler as GET, handler as POST };
