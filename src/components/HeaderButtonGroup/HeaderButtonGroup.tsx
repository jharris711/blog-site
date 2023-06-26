'use client';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ArrowRight from '@/svgIcons/ArrowRight';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type ProfileData = Database['public']['Tables']['profiles']['Row'];

const HeaderButtonGroup = ({
  session,
  profileData,
}: {
  session: Session | null;
  profileData: ProfileData | null;
}) => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    router.refresh();
  };

  return (
    <>
      <nav className='md:ml-auto flex flex-wrap items-center text-base justify-center'>
        <a
          href='/blogs'
          className='mr-5 hover:text-indigo-500 hover:dark:text-indigo-500 '
        >
          Blogs
        </a>
        <a
          href='/contact'
          className='mr-5 hover:text-indigo-500 hover:dark:text-indigo-500'
        >
          Contact
        </a>
        {session ? (
          <a
            href='#'
            onClick={handleSignOut}
            className='mr-5 hover:text-indigo-500 hover:dark:text-indigo-500'
          >
            Sign out
          </a>
        ) : (
          <a
            href='/auth/signin'
            className='mr-5 hover:text-indigo-500 hover:dark:text-indigo-500'
          >
            Sign in
          </a>
        )}
      </nav>
      {session && profileData ? (
        <a href='/account'>
          <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-600'>
            <span className='text-xs font-medium text-white leading-none'>
              {profileData.full_name
                ? `${profileData.full_name[0]}`
                : profileData.username
                ? `${profileData.username[0]}`
                : session.user.email
                ? `${session.user.email[0]}`
                : ''}
            </span>
          </span>
        </a>
      ) : (
        <a href='/auth/signup'>
          <button className='inline-flex items-center dark:bg-gray-100 bg-indigo-200 hover:text-indigo-500 dark:text-gray-900 hover:dark:bg-indigo-500 hover:dark:text-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0'>
            Sign Up
            <ArrowRight className='w-4 h-4 ml-1' />
          </button>
        </a>
      )}
    </>
  );
};

export default HeaderButtonGroup;
