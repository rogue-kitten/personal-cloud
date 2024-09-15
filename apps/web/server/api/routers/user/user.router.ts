import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../../trpc';
import { createUserSchema, filterQuery } from './user.schema';
import {
  createUserHandler,
  getUserDetailsById,
  getUsersHandler,
} from './user.service';

const userRouter = createTRPCRouter({
  createUser: privateProcedure
    .input(createUserSchema)
    .mutation(({ input }) => createUserHandler({ input })),

  getUsers: privateProcedure
    .input(filterQuery)
    .query(({ input }) => getUsersHandler({ filterQuery: input })),

  getUserDetails: privateProcedure
    .input(z.void())
    .query(({ ctx }) => getUserDetailsById({ userId: ctx.userId })),
});

export default userRouter;
