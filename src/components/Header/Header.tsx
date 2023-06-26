import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import CubeIcon from '@/svgIcons/CubeIcon';
import { Database } from '@/types/supabase';
import HeaderButtonGroup from '../HeaderButtonGroup';

const Header = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.user?.id)
    .single();

  return (
    <header className='dark:text-gray-400 dark:bg-gray-900 bg-gray-100 body-font sticky top-0 shadow'>
      <div className='container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center'>
        <a
          href='/'
          className='flex title-font font-medium items-center text-gray-900 dark:text-gray-100 mb-4 md:mb-0'
        >
          <CubeIcon className='w-10 h-10 text-white p-2 bg-indigo-500 rounded-full' />
          <span className='ml-3 text-xl'>J. Harris Web Dev</span>
        </a>
        <HeaderButtonGroup session={session} profileData={profileData} />
      </div>
    </header>
  );
};

export default Header;
