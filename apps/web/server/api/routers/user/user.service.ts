import { db } from '@/drizzle';
import { SelectedUser, users } from '@/drizzle/schema';
import { TRPCError } from '@trpc/server';
import { eq, like } from 'drizzle-orm';
import {
  CreateUserInput,
  EditPersonalDetails,
  FilterQueryInput,
} from './user.schema';

export const createUserHandler = async ({
  input,
}: {
  input: CreateUserInput;
}) => {
  try {
    const user = await db.insert(users).values(input).returning();

    return {
      status: 'success',
      data: {
        user,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err instanceof TRPCError) return err;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const getUsersHandler = async ({
  filterQuery,
}: {
  filterQuery: FilterQueryInput;
}) => {
  try {
    const { limit, page, name } = filterQuery;
    const take = limit || 10;
    const skip = (page - 1) * limit;

    let selected_users: SelectedUser[] = [];

    if (name && name.length > 0) {
      selected_users = await db
        .select()
        .from(users)
        .where(like(users.email, `%${name}%`))
        .offset(skip)
        .limit(take);
    } else {
      selected_users = await db.select().from(users).offset(skip).limit(take);
    }

    return {
      status: 'success',
      results: selected_users.length,
      data: {
        selected_users,
      },
    };
  } catch (err) {
    if (err instanceof TRPCError) return err;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Some error occured',
    });
  }
};

export const getUserDetailsById = async ({ userId }: { userId: string }) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (!user || user.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    return {
      status: 'success',
      data: {
        user: user[0],
      },
    };
  } catch (err) {
    if (err instanceof TRPCError) return err;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Some error occured',
    });
  }
};

export const editUser = async ({
  payload,
}: {
  payload: EditPersonalDetails;
}) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, payload.id));

    if (!user || user.length === 0)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    await db
      .update(users)
      .set({
        name: payload.name,
        image: payload.image ?? null,
      })
      .where(eq(users.id, payload.id));

    return {
      status: 'success',
    };
  } catch (error) {
    if (error instanceof TRPCError) return error;
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });
  }
};
