'use client';

import {
  createNotes,
  CreateNotes,
} from '@/server/api/routers/notes/notes.schema';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCError } from '@trpc/server';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Spinner from './icons/spinner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface BaseProps {
  trigger: React.ReactNode;
  triggerAsChild?: boolean;
}

interface EditProps extends BaseProps {
  id: string;
  defaultValues: CreateNotes;
}

type NotesDialogueProps = BaseProps | EditProps;

function NotesDialogue(props: NotesDialogueProps) {
  const [open, setOpen] = useState(false);

  const isEdit = 'id' in props;

  const { mutateAsync: createNote, isLoading } =
    trpc.notes.createNote.useMutation();

  const { mutateAsync: editNote, isLoading: isEditing } =
    trpc.notes.editNotesForUser.useMutation();

  const defaultValues: CreateNotes = useMemo(() => {
    if (isEdit) {
      return props.defaultValues;
    } else
      return {
        note: '',
        title: '',
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<CreateNotes>({
    resolver: zodResolver(createNotes),
    defaultValues,
  });

  const util = trpc.useUtils();

  const onSubmit = useCallback((value: CreateNotes) => {
    if (isEdit) {
      editNote({
        ...value,
        noteId: props.id,
      })
        .then((note) => {
          if (note instanceof TRPCError) {
            console.log('Error', note);
            toast.error('Unable to edit  note');
          } else {
            toast.success('Successfully edited note');
            setOpen(false);
            util.notes.getNotesForUser.invalidate();
          }
        })
        .catch((err) => {
          console.log('Error', err);
          toast.error('Unable to edit note');
        });
    } else {
      createNote(value)
        .then((note) => {
          if (note instanceof TRPCError) {
            console.log('Error', note);
            toast.error('Unable to create a note');
          } else {
            toast.success('Successfully added a new note');
            setOpen(false);
            util.notes.getNotesForUser.invalidate();
          }
        })
        .catch((err) => {
          console.log('Error', err);
          toast.error('Unable to create a note');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      open={open}
      key={isEdit ? props.id : 'NEW'}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild={props.triggerAsChild ?? false}>
        {props.trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit note' : 'Add a new Note'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Add a title for the note' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Add your note here' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isLoading || isEditing}>
              {isLoading || isEditing ? (
                <Spinner />
              ) : isEdit ? (
                'Edit note'
              ) : (
                'Add note'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default NotesDialogue;
