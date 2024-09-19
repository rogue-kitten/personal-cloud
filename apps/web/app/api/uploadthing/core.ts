import { auth } from '@/auth';
import { uploadFileForUser } from '@/server/api/routers/files/files.service';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { UploadedFileData } from 'uploadthing/types';

const f = createUploadthing();

const middleware = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.id)
    throw new UploadThingError('Unauthorized');

  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId: session.user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
  fileType,
}: {
  file: UploadedFileData;
  metadata: Awaited<ReturnType<typeof middleware>>;
  fileType: 'image' | 'document';
}) => {
  try {
    await uploadFileForUser({
      payload: {
        fileId: file.key,
        fileType,
        mimeType: file.type,
        fileSize: file.size,
        fileName: file.name,
      },
      userId: metadata.userId,
    });
  } catch (error) {
    console.log('there has been some error in the onUploadComplete', error);
    throw new UploadThingError('some error');
  }

  return { uploadedBy: metadata.userId };
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(middleware)
    .onUploadComplete(async (opts) =>
      onUploadComplete({
        ...opts,
        fileType: 'image',
      }),
    ),
  fileUploader: f({ blob: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(async (opts) =>
      onUploadComplete({
        ...opts,
        fileType: 'document',
      }),
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
