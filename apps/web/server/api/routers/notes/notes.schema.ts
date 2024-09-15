import { z } from 'zod';

export const getNotes = z.object({
  all: z.boolean().default(false),
});

export type GetNotes = z.TypeOf<typeof getNotes>;

export type GetNotesForUser = GetNotes & {
  userId: string;
};

export const createNotes = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(0, { message: 'Title cannot be an empty string' }),
  note: z
    .string({ required_error: 'Note is required' })
    .min(0, { message: 'Note cannot be an empty string' }),
});

export type CreateNotes = z.TypeOf<typeof createNotes>;

export const editNotes = z.object({
  noteId: z.string({ required_error: 'Note Id is required' }).uuid(),
  title: z
    .string({ required_error: 'Title is required' })
    .min(0, { message: 'Title cannot be an empty string' }),
  note: z
    .string({ required_error: 'Note is required' })
    .min(0, { message: 'Note cannot be an empty string' }),
});

export type EditNotes = z.TypeOf<typeof editNotes>;
