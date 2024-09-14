import { auth } from '@/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { cookies } from 'next/headers';
import SuperJSON from 'superjson';

type CreateContextOptions = {
  headers: Headers;
  cookies: ReturnType<typeof cookies>;
};

export const createTRPCContext = async (opt: CreateContextOptions) => {
  const session = await auth();

  return {
    headers: opt.headers,
    cookies: opt.cookies,
    session,
  };
};

export const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ shape }) {
      return shape;
    },
  });

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const validate_token = t.middleware(({ ctx, next }) => {
  const token = ctx?.headers?.get('x-api-key');

  console.log('token', token);

  // we have hardcoded the authentication token to foobarbaz
  if (!token || token !== 'foobarbaz')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You do not have a valid token',
    });

  return next({
    ctx,
  });
});

const is_authenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const openapiProcedure = t.procedure.use(validate_token);

export const privateProcedure = t.procedure
  .use(validate_token)
  .use(is_authenticated);
