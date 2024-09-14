import { db } from '@/drizzle';
import { SelectedUser, users } from '@/drizzle/schema';
import { TRPCError } from '@trpc/server';
import { like } from 'drizzle-orm';
import { CreateUserInput, FilterQueryInput } from './user.schema';

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
      console.log('getting the users from the else block', skip, take);
      selected_users = await db.select().from(users).offset(skip).limit(take);
    }

    return {
      status: 'success',
      results: selected_users.length,
      data: {
        selected_users,
      },
    };
  } catch (err: any) {
    if (err instanceof TRPCError) return err;
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};
