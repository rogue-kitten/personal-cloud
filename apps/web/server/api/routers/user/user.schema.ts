import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  email: z.string({ required_error: 'Email is required' }),
});

export const filterQuery = z.object({
  limit: z.number().default(10),
  page: z.number().default(1),
  name: z.string().optional(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
