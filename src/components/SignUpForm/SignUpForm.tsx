'use client';
import { useRef, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { redirect, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const SignUpForm = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ref.current) return;

    const formData = new FormData(ref.current);

    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) return;

    const user = {
      email,
      password,
      options: {
        emailRedirectTo: `https://jsharris.dev/api/auth/callback`,
      },
    };

    const { error } = await supabase.auth.signUp(user);

    if (error) throw error;

    router.refresh();
    router.push('/auth/confirm');
  };

  function closeModal() {
    setOpen(false);
  }

  function openModal() {
    setOpen(true);
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Terms and Conditions
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      Terms and Conditions for Josh Harris Web Dev These Terms
                      and Conditions (&quot;Agreement&quot;) govern your use of
                      Josh Harris Web Dev (&quot;the Website&quot;). By
                      accessing or using the Website, you agree to be bound by
                      this Agreement. If you do not agree with any part of these
                      Terms and Conditions, you must not use the Website.
                      Intellectual Property a. All content, including but not
                      limited to articles, blog posts, images, logos, and
                      trademarks, displayed on the Website is the intellectual
                      property of Josh Harris Web Dev or its licensors and is
                      protected by copyright laws and other intellectual
                      property rights. b. You may not modify, reproduce,
                      distribute, or create derivative works of any content from
                      the Website without prior written permission from Josh
                      Harris Web Dev. User Conduct a. You agree to use the
                      Website in accordance with applicable laws and
                      regulations. b. You shall not engage in any of the
                      following activities: i. Posting, transmitting, or sharing
                      content that is unlawful, harmful, defamatory, obscene, or
                      otherwise objectionable. ii. Harassing, stalking, or
                      threatening others or violating their rights. iii.
                      Impersonating any person or entity or falsely representing
                      your affiliation with any person or entity. iv. Uploading
                      or transmitting viruses, worms, or any other malicious
                      code. v. Interfering with the operation or security of the
                      Website or attempting to gain unauthorized access to any
                      part of the Website. c. Josh Harris Web Dev reserves the
                      right to suspend or terminate your access to the Website
                      if you violate any provisions of this Agreement.
                      Third-Party Links a. The Website may contain links to
                      third-party websites or resources. b. Josh Harris Web Dev
                      is not responsible for the availability or accuracy of any
                      such external sites or resources. c. You acknowledge and
                      agree that Josh Harris Web Dev shall not be liable for any
                      damage or loss arising from your use of any third-party
                      websites or resources. Disclaimer of Warranty a. The
                      Website and its content are provided on an &quot;as
                      is&quot; and &quot;as available&quot; basis without any
                      warranties, express or implied. b. Josh Harris Web Dev
                      does not warrant that the Website will be error-free,
                      uninterrupted, secure, or free from viruses or other
                      harmful components. Limitation of Liability a. To the
                      maximum extent permitted by applicable law, Josh Harris
                      Web Dev and its affiliates, officers, employees, agents,
                      partners, and licensors shall not be liable for any
                      indirect, incidental, special, consequential, or exemplary
                      damages, including but not limited to loss of profits,
                      data, or goodwill. Modification of Terms and Conditions a.
                      Josh Harris Web Dev reserves the right to modify or amend
                      these Terms and Conditions at any time. b. Any changes to
                      the Agreement will be effective immediately upon posting
                      on the Website. c. Your continued use of the Website after
                      any such modifications shall constitute your consent to
                      the updated Terms and Conditions. Governing Law and
                      Jurisdiction a. This Agreement shall be governed by and
                      construed in accordance with the laws of Josh Harris Web
                      Dev. b. Any dispute arising out of or in connection with
                      this Agreement shall be subject to the exclusive
                      jurisdiction of the courts of Josh Harris Web Dev.
                    </p>
                  </div>

                  <div className='mt-4'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <form
        className='space-y-4 md:space-y-6'
        action='#'
        ref={ref}
        onSubmit={handleSubmit}
      >
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
        <div>
          <label
            htmlFor='confirm-password'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Confirm password
          </label>
          <input
            type='password'
            name='confirm-password'
            id='confirm-password'
            placeholder='••••••••'
            className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            required={true}
          />
        </div>
        <div className='flex items-start'>
          <div className='flex items-center h-5'>
            <input
              id='terms'
              aria-describedby='terms'
              type='checkbox'
              className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
              required={true}
            />
          </div>
          <div className='ml-3 text-sm'>
            <label
              htmlFor='terms'
              className='font-light text-gray-500 dark:text-gray-300'
            >
              I accept the{' '}
              <button
                className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                onClick={openModal}
              >
                Terms and Conditions
              </button>
            </label>
          </div>
        </div>
        <button
          type='submit'
          className='w-full text-white bg-indigo-500 hover:shadow hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
        >
          Create an account
        </button>
        <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
          Already have an account?{' '}
          <a
            href='/auth/signin'
            className='font-medium text-primary-600 hover:underline dark:text-primary-500'
          >
            Sign in here
          </a>
        </p>
      </form>
    </>
  );
};

export default SignUpForm;
