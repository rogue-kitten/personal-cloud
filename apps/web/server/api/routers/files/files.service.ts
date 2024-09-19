import { db } from '@/drizzle';
import { files, SelectedFiles } from '@/drizzle/schema';
import { TRPCError } from '@trpc/server';
import { and, count, eq } from 'drizzle-orm';
import { utapi } from '../../uploadthing';
import { DeleteQuery, FilterQueryInput, UploadFile } from './files.schema';

export const uploadFileForUser = async ({
  payload,
  userId,
}: {
  payload: UploadFile;
  userId: string;
}) => {
  try {
    const file = await db
      .insert(files)
      .values({
        ...payload,
        userId,
      })
      .returning();

    return {
      status: 'success',
      data: {
        file,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) return error;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });
  }
};

export const getFilesForUser = async ({
  filter,
  userId,
}: {
  filter: FilterQueryInput;
  userId: string;
}) => {
  try {
    const { limit, page, fileType } = filter;
    const take = limit || 10;
    const skip = (page - 1) * limit;

    let userFiles: SelectedFiles[] = [];

    let document_count = 0;

    if (fileType) {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.fileType, fileType)))
        .offset(skip)
        .limit(take);

      document_count = (
        await db
          .select({ count: count() })
          .from(files)
          .where(and(eq(files.userId, userId), eq(files.fileType, fileType)))
      )[0].count;
    } else {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId)))
        .offset(skip)
        .limit(take);
      document_count = (
        await db
          .select({ count: count() })
          .from(files)
          .where(and(eq(files.userId, userId)))
      )[0].count;
    }

    return {
      status: 'success',
      data: {
        files: userFiles,
        count: document_count,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) return error;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });
  }
};

export const deleteFile = async ({
  payload,
}: {
  payload: DeleteQuery & { userId: string };
}) => {
  try {
    const file = await db
      .select()
      .from(files)
      .where(eq(files.id, payload.id))
      .limit(1);

    if (!files || file.length === 0)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });

    if (file[0].userId != payload.userId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'only the file owner can delete the file ',
      });

    await utapi.deleteFiles([file[0].fileId]);

    await db.delete(files).where(eq(files.id, payload.id));

    return {
      status: 'success',
    };
  } catch (error) {
    if (error instanceof TRPCError) return error;

    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Error occured while deleting the file',
    });
  }
};
