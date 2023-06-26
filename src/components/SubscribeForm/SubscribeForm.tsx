'use client';
import { useCallback, useRef, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import ConfirmIcon from '@/svgIcons/ConfirmIcon';
import CloseIcon from '@/svgIcons/CloseIcon';
import ErrorIcon from '@/svgIcons/ErrorIcon';
import InfoCircleIcon from '@/svgIcons/InfoCircleIcon';

interface Toast {
  type: string;
  message: string;
}

const SubscribeForm = () => {
  const [toast, setToast] = useState<Toast | null>(null);
  const ref = useRef<HTMLFormElement>(null);
  const supabase = createClientComponentClient<Database>();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ref.current) return;

    const formData = new FormData(ref.current);
    const email = formData.get('email') as string;

    const { error } = await supabase.from('subscribers').insert({ email });

    if (error) {
      if (error.code === '23505') {
        setToast({ type: 'error', message: 'You are already subscribed' });
        setTimeout(() => {
          setToast(null);
        }, 3000);
        return;
      }
      setToast({ type: 'error', message: error.message });
      setTimeout(() => {
        setToast(null);
      }, 3000);
      return;
    }

    setToast({ type: 'success', message: 'Thanks for subscribing' });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <form action='#' ref={ref} onSubmit={handleSubscribe}>
      {toast ? (
        <div
          id='toast-bottom-left'
          className='animate-fade-down animate-ease-in-out fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-red-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 z-50'
          role='alert'
        >
          {toast.type === 'success' ? (
            <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200'>
              <ConfirmIcon className='w-5 h-5' />
              <span className='sr-only'>Send icon</span>
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
      <div className='items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0'>
        <div className='relative w-full'>
          <label
            htmlFor='email'
            className='hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            Email address
          </label>
          <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
            <svg
              className='w-5 h-5 text-gray-500 dark:text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></path>
              <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></path>
            </svg>
          </div>
          <input
            className='block p-3 pl-10 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
            placeholder='Enter your email'
            type='email'
            id='email'
            name='email'
            required={true}
          />
        </div>
        <div>
          <button
            type='submit'
            className='py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
          >
            Subscribe
          </button>
        </div>
      </div>
      <div className='mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300'>
        We care about the protection of your data.{' '}
        <a
          href='#'
          className='font-medium text-primary-600 dark:text-primary-500 hover:underline'
        >
          Read our Privacy Policy
        </a>
        .
      </div>
    </form>
  );
};

export default SubscribeForm;
