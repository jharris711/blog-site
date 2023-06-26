'use client';
import { FormEvent, useCallback, useRef, useState } from 'react';
import CloseIcon from '@/svgIcons/CloseIcon';
import ErrorIcon from '@/svgIcons/ErrorIcon';
import InfoCircleIcon from '@/svgIcons/InfoCircleIcon';
import SendIcon from '@/svgIcons/SendIcon';

interface Toast {
  type: string;
  message: string;
}

const ContactForm = () => {
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(ref.current as HTMLFormElement);

    const data = {
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    setIsSending(true);

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        const { message } = jsonData;
        setToast({ type: 'success', message });
        setTimeout(() => {
          setToast(null);
        }, 3000);
      })
      .catch((err) => {
        const { message } = err;
        setToast({ type: 'error', message });
        setTimeout(() => {
          setToast(null);
        }, 3000);
      })
      .finally(() => {
        ref.current?.reset();
        setIsSending(false);
      });
  };

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <form ref={ref} action='#' className='space-y-8' onSubmit={handleSubmit}>
      {isSending ? (
        <div
          id='toast-bottom-left'
          className='animate-fade-down animate-ease-in-out fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-red-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800'
          role='alert'
        >
          <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-100'>
            <InfoCircleIcon className='w-5 h-5' />
            <span className='sr-only'>Info icon</span>
          </div>

          <div className='ml-3 text-sm font-normal'>Sending...</div>
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
      {toast ? (
        <div
          id='toast-bottom-left'
          className='animate-fade-down animate-ease-in-out fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-red-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800'
          role='alert'
        >
          {toast.type === 'success' ? (
            <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200'>
              <SendIcon className='w-5 h-5' />
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
          className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Your email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
          placeholder='your@email.com'
          required
        />
      </div>
      <div>
        <label
          htmlFor='subject'
          className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Subject
        </label>
        <input
          type='text'
          id='subject'
          name='subject'
          className='block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
          placeholder='Let us know how we can help you'
          required
        />
      </div>
      <div className='sm:col-span-2'>
        <label
          htmlFor='message'
          className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400'
        >
          Your message
        </label>
        <textarea
          id='message'
          name='message'
          rows={6}
          className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
          placeholder="Hey, I'm a huge fan!"
        ></textarea>
      </div>
      <button
        type='submit'
        className='py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-indigo-500 sm:w-fit hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
      >
        Send message
      </button>
    </form>
  );
};

export default ContactForm;
