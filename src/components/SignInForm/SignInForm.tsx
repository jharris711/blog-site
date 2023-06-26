'use client';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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

const SignInForm = () => {
  const [toast, setToast] = useState<Toast | null>(null);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!ref.current) return;

    const formData = new FormData(ref.current);

    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setToast({ type: 'error', message: error.message });
      return;
    }

    setToast({ type: 'success', message: 'Signed in successfully' });

    setTimeout(() => {
      setToast(null);
      router.refresh();
      router.push('/');
    }, 1250);
  };

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <>
      <form
        ref={ref}
        className='space-y-4 md:space-y-6'
        onSubmit={handleSubmit}
      >
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
        <div>
          <label
            htmlFor='email'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Your email
          </label>
          <input
            type='email'
            name='email'
            id='email'
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='name@company.com'
            required={true}
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Password
          </label>
          <input
            type='password'
            name='password'
            id='password'
            placeholder='••••••••'
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            required={true}
          />
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-start'></div>
          <a
            href='/auth/reset-password'
            className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
          >
            Forgot password?
          </a>
        </div>
        <button
          type='submit'
          className='w-full text-white bg-indigo-500 hover:shadow hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
        >
          Sign in
        </button>
        <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
          Don&apos;t have an account yet?{' '}
          <a
            href='/auth/signup'
            className='font-medium text-primary-600 hover:underline dark:text-primary-500'
          >
            Sign up
          </a>
        </p>
      </form>
    </>
  );
};

export default SignInForm;
