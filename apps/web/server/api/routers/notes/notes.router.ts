import { createTRPCRouter, privateProcedure } from '../../trpc';
import { createNotes, deleteNote, editNotes, getNotes } from './notes.schema';
import {
  createNewNoteForUser,
  deleteNoteById,
  editNoteForUser,
  getNotesForUser,
} from './notes.service';

const notesRouter = createTRPCRouter({
  createNote: privateProcedure.input(createNotes).mutation(({ input, ctx }) =>
    createNewNoteForUser({
      note: {
        ...input,
        userId: ctx.userId,
      },
    }),
  ),

  getNotesForUser: privateProcedure.input(getNotes).query(({ input, ctx }) =>
    getNotesForUser({
      ...input,
      userId: ctx.userId,
    }),
  ),

  editNotesForUser: privateProcedure
    .input(editNotes)
    .mutation(({ input, ctx }) =>
      editNoteForUser({
        payload: {
          ...input,
          userId: ctx.userId,
        },
      }),
    ),

  deleteNote: privateProcedure.input(deleteNote).mutation(({ ctx, input }) =>
    deleteNoteById({
      payload: {
        id: input.id,
        userId: ctx.userId,
      },
    }),
  ),
});

export default notesRouter;
