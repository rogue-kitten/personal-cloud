import { createTRPCRouter, privateProcedure } from '../../trpc';
import { filterQuery, uploadFile } from './files.schema';
import { getFilesForUser, uploadFileForUser } from './files.service';

export const fileRouter = createTRPCRouter({
  getFiles: privateProcedure
    .input(filterQuery)
    .query(({ input, ctx }) =>
      getFilesForUser({ filter: input, userId: ctx.userId })
    ),

  uploadFile: privateProcedure
    .input(uploadFile)
    .mutation(({ input, ctx }) =>
      uploadFileForUser({ payload: input, userId: ctx.userId })
    ),
});
