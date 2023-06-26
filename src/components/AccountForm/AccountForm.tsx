'use client';
import { useCallback, useEffect, useState } from 'react';
import { Database } from '@/types/supabase';
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import AvatarUpload from '../AvatarUpload';
import { PostgrestError } from '@supabase/postgrest-js';
import ErrorIcon from '@/svgIcons/ErrorIcon';
import CloseIcon from '@/svgIcons/CloseIcon';
import { genUsername } from '@/services/genUsername';

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>();
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        if (!data.username) {
          setUsername(genUsername());
        } else {
          setUsername(data.username);
        }
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      const e = err as PostgrestError;
      alert('Error loading user data: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch (err) {
      const e = err as PostgrestError;
      if (e.code === '23505') {
        setError('This username has already been taken.');
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const closeToast = useCallback(() => {
    setShowToast(false);
  }, []);

  return (
    <div className='flex flex-col space-2'>
      {error && showToast ? (
        <div
          id='toast-bottom-left'
          className='fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-red-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800'
          role='alert'
        >
          <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200'>
            <ErrorIcon className='w-5 h-5' />
            <span className='sr-only'>Error icon</span>
          </div>
          <div className='ml-3 text-sm font-normal'>{error}</div>
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
      <section className='bg-white dark:bg-gray-900'>
        <div className='max-w-2xl px-4 py-8 mx-auto lg:py-16'>
          <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
            Edit Your Account
          </h2>
          <AvatarUpload
            uid={user?.id}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ fullname, username, website, avatar_url: url });
            }}
          />
          <form action='#'>
            <div className='grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5'>
              <div className='sm:col-span-2'>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  value={session?.user.email}
                  placeholder='Enter your email'
                  disabled
                  required
                />
              </div>
            </div>
            <div className='grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5'>
              <div className='sm:col-span-2'>
                <label
                  htmlFor='full-name'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Full Name
                </label>
                <input
                  type='full-name'
                  name='full-name'
                  id='full-name'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  value={fullname || ''}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder='Enter your name'
                  required
                />
              </div>
            </div>
            <div className='grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5'>
              <div className='sm:col-span-2'>
                <label
                  htmlFor='username'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Username
                </label>
                <input
                  type='username'
                  name='username'
                  id='username'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Enter a username'
                  required={true}
                />
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <button
                type='submit'
                onClick={() =>
                  updateProfile({ fullname, username, website, avatar_url })
                }
                disabled={loading}
                className='text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blues-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Update profile
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
