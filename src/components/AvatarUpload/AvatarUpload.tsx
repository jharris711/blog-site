'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { StorageError } from '@supabase/storage-js';
import CloseIcon from '@/svgIcons/CloseIcon';
import ConfirmIcon from '@/svgIcons/ConfirmIcon';
import ErrorIcon from '@/svgIcons/ErrorIcon';
import InfoCircleIcon from '@/svgIcons/InfoCircleIcon';

type Profiles = Database['public']['Tables']['profiles']['Row'];
interface Toast {
  type: string;
  message: string;
}

export default function AvatarUpload({
  uid,
  url,
  size,
  onUpload,
}: {
  uid?: string;
  url: Profiles['avatar_url'];
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(url);
  const [toast, setToast] = useState<Toast | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (err) {
        const { message } = err as StorageError;
        setToast({ type: 'error', message });
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (err) {
      const { message } = err as StorageError;
      setToast({ type: 'error', message });
    } finally {
      setUploading(false);
    }
  };

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <div className='h-100 md:h-200'>
      {toast ? (
        <div
          id='toast-bottom-left'
          className='animate-fade-down animate-ease-in-out fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-red-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 z-50'
          role='alert'
        >
          {toast.type === 'success' ? (
            <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200'>
              <ConfirmIcon className='w-5 h-5' />
              <span className='sr-only'>Confirm icon</span>
            </div>
          ) : toast.type === 'error' ? (
            <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200'>
              <ErrorIcon className='w-5 h-5' />
              <span className='sr-only'>Error icon</span>
            </div>
          ) : (
            <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200'>
              <InfoCircleIcon className='w-5 h-5' />
              <span className='sr-only'>Info icon</span>
            </div>
          )}

          <div className='ml-3 text-sm font-normal'>{toast.message}</div>
          <button
            type='button'
            className='ml-auto -mx-1.5 -my-1.5 bg-red-100 text-gray-400 hover:text-red-600 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
            data-dismiss-target='#toast-danger'
            aria-label='Close'
            onClick={closeToast}
          >
            <span className='sr-only'>Close</span>
            <CloseIcon className='w-5 h-5' />
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className='w-full grid gap-4 mb-4'>
        {avatarUrl ? (
          <Image
            width={size}
            height={size}
            src={avatarUrl}
            alt='Avatar'
            className='avatar image border-2 border-gray-300 border-dashed rounded-md'
            style={{ height: size, width: size }}
          />
        ) : (
          <></>
        )}
        <label className='flex justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-700 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none'>
          <span className='flex items-center space-x-2'>
            {uploading ? (
              'Uploading ...'
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-6 h-6 text-gray-600 dark:text-gray-100'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
                <span className='font-medium text-gray-600 dark:text-gray-100'>
                  Drop a profile photo or{' '}
                  <span className='text-blue-600 dark:text-blue-400 underline'>
                    browse
                  </span>
                </span>
              </>
            )}
          </span>
          <input
            type='file'
            name='file_upload'
            className='hidden'
            id='single'
            accept='image/*'
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </div>
      {/* <div style={{ width: size }}>
        <label className='button primary block' htmlFor='single'>
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          className=''
          type='file'
          id='single'
          accept='image/*'
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>*/}
    </div>
  );
}
