import { createTRPCRouter } from '@/server/api/trpc';
import { openapiRoutes } from './routers/openapi/openapi.router';
import userRouter from './routers/user/user.router';

export const appRouter = createTRPCRouter({
  openapi: openapiRoutes,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
