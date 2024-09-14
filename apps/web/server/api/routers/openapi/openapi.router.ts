import { z } from 'zod';
import { createTRPCRouter, openapiProcedure } from '../../trpc';
import { filterQuery } from '../user/user.schema';
import { getUsersHandler } from '../user/user.service';

export const openapiRoutes = createTRPCRouter({
  healthchecker: openapiProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/healthcheck',
        tags: ['healthcheck'],
        summary: 'Healthcheck route',
      },
    })
    .input(z.void())
    .output(
      z.object({
        status: z.string(),
        message: z.string(),
      })
    )
    .query(() => {
      return {
        status: 'success',
        message: 'pong',
      };
    }),
  allUsers: openapiProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/user',
        tags: ['user'],
        summary: 'Get All users',
      },
    })
    .input(filterQuery)
    .output(z.any())
    .query(({ input }) => getUsersHandler({ filterQuery: input })),
});
