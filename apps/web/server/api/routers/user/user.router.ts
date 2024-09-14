import { createTRPCRouter, privateProcedure } from '../../trpc';
import { createUserSchema, filterQuery } from './user.schema';
import { createUserHandler, getUsersHandler } from './user.service';

const userRouter = createTRPCRouter({
  createUser: privateProcedure
    .input(createUserSchema)
    .mutation(({ input }) => createUserHandler({ input })),

  getUsers: privateProcedure
    .input(filterQuery)
    .query(({ input }) => getUsersHandler({ filterQuery: input })),

  getPrivateUsersRoute: privateProcedure.query(({ ctx }) => {
    console.log('this is inside the private procedure');

    console.log('this is the session', ctx.session);

    return { success: true, message: 'You are authenicated' };
  }),
});

export default userRouter;
