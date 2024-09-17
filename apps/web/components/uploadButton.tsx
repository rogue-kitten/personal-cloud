import { useUploadThing } from '@/utils/uploadThing-helpers';
import { CirclePlus } from 'lucide-react';
import { ClientUploadedFileData } from 'uploadthing/types';
import Spinner from './icons/spinner';

interface UploadButtonProps {
  endpoint: 'imageUploader' | 'fileUploader';
  onClientUploadComplete?: (
    res: ClientUploadedFileData<{ uploadedBy: string }>[],
  ) => void;
  onUploadError?: (error: Error) => void;
  acceptedFileTypes?: string;
}

const UploadButton = ({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  acceptedFileTypes = '*',
}: UploadButtonProps) => {
  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete,
    onUploadError,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await startUpload(Array.from(files));
    }
  };

  return (
    <button
      className='relative cursor-pointer overflow-hidden'
      disabled={isUploading}
    >
      <input
        type='file'
        className='absolute inset-0 opacity-0'
        onChange={handleFileChange}
        accept={acceptedFileTypes}
      />
      {isUploading ? <Spinner className='text-blue-500' /> : <CirclePlus />}
    </button>
  );
};

export default UploadButton;
