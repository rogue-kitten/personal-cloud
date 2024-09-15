import { createTRPCRouter } from '@/server/api/trpc';
import { fileRouter } from './routers/files/files.router';
import notesRouter from './routers/notes/notes.router';
import { openapiRoutes } from './routers/openapi/openapi.router';
import userRouter from './routers/user/user.router';

export const appRouter = createTRPCRouter({
  openapi: openapiRoutes,
  user: userRouter,
  notes: notesRouter,
  files: fileRouter,
});

export type AppRouter = typeof appRouter;
