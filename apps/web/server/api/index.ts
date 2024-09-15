import { createTRPCRouter } from '@/server/api/trpc';
import notesRouter from './routers/notes/notes.router';
import { openapiRoutes } from './routers/openapi/openapi.router';
import userRouter from './routers/user/user.router';

export const appRouter = createTRPCRouter({
  openapi: openapiRoutes,
  user: userRouter,
  notes: notesRouter,
});

export type AppRouter = typeof appRouter;
