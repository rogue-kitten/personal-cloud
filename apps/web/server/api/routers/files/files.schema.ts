import { z } from 'zod';

export const uploadFile = z.object({
  fileName: z
    .string({ required_error: 'File Name is required' })
    .min(1, { message: 'File Name cannot be empty' }),
  fileId: z
    .string({ required_error: 'File Id is required' })
    .min(1, { message: 'File Id cannot be empty' }),
  fileType: z.enum(['image', 'document'], {
    required_error: 'File Type is required',
  }),
  fileSize: z.number({ required_error: 'File Size is required' }),
});

export type UploadFile = z.TypeOf<typeof uploadFile>;

export const filterQuery = z.object({
  limit: z.number().default(10),
  page: z.number().default(1),
  fileType: z.enum(['image', 'document']).optional(),
});

export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
