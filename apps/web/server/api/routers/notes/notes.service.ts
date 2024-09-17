import { db } from '@/drizzle';
import { InsertNotes, notes, SelectedNotes } from '@/drizzle/schema';
import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import { EditNotes, GetNotesForUser } from './notes.schema';

export const getNotesForUser = async ({ all, userId }: GetNotesForUser) => {
  try {
    let getNotes: SelectedNotes[] = [];
    if (all) {
      getNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.userId, userId))
        .orderBy(desc(notes.createdAt));
    } else {
      getNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.userId, userId))
        .limit(3)
        .orderBy(desc(notes.createdAt));
    }

    return {
      status: 'success',
      data: {
        notes: getNotes,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) return error;
    console.log('error', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected Error',
    });
  }
};

export const createNewNoteForUser = async ({ note }: { note: InsertNotes }) => {
  try {
    const newNote = await db.insert(notes).values(note).returning();

    return {
      status: 'success',
      data: {
        note: newNote,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) return error;
    console.log('error', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected Error',
    });
  }
};

export const editNoteForUser = async ({
  payload,
}: {
  payload: EditNotes & { userId: string };
}) => {
  try {
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, payload.noteId));

    if (!note || note.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid noteId' });
    }

    if (note[0].userId != payload.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only the creator can edit notes',
      });
    }

    const updated_note = await db
      .update(notes)
      .set({ note: payload.note, title: payload.title, updatedAt: new Date() })
      .where(eq(notes.id, payload.noteId))
      .returning();

    return {
      status: 'success',
      data: {
        note: updated_note,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) return error;
    console.log('error', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected Error',
    });
  }
};
