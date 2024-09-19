import { createTRPCRouter, privateProcedure } from '../../trpc';
import { deleteQuery, filterQuery, uploadFile } from './files.schema';
import {
  deleteFile,
  getFilesForUser,
  uploadFileForUser,
} from './files.service';

export const fileRouter = createTRPCRouter({
  getFiles: privateProcedure
    .input(filterQuery)
    .query(({ input, ctx }) =>
      getFilesForUser({ filter: input, userId: ctx.userId }),
    ),

  uploadFile: privateProcedure
    .input(uploadFile)
    .mutation(({ input, ctx }) =>
      uploadFileForUser({ payload: input, userId: ctx.userId }),
    ),

  deleteFile: privateProcedure.input(deleteQuery).mutation(({ ctx, input }) =>
    deleteFile({
      payload: {
        id: input.id,
        userId: ctx.userId,
      },
    }),
  ),
});
