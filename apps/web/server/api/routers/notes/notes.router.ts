import { createTRPCRouter, privateProcedure } from '../../trpc';
import { createNotes, editNotes, getNotes } from './notes.schema';
import {
  createNewNoteForUser,
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
    })
  ),

  getNotesForUser: privateProcedure.input(getNotes).query(({ input, ctx }) =>
    getNotesForUser({
      ...input,
      userId: ctx.userId,
    })
  ),

  editNotesForUser: privateProcedure
    .input(editNotes)
    .mutation(({ input, ctx }) =>
      editNoteForUser({
        payload: {
          ...input,
          userId: ctx.userId,
        },
      })
    ),
});

export default notesRouter;
