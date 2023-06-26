import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Hero from '@/components/Hero';
import RecentPosts from '@/components/RecentPosts';
import { Database } from '@/types/supabase';

const Home = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: initialPosts } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2);

  return (
    <>
      <Hero />
      <section className='bg-white dark:bg-gray-900'>
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
          <div className='mx-auto max-w-screen-sm text-center lg:mb-16 mb-8'>
            <h2 className='mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white'>
              Recent Posts
            </h2>
            <p className='font-light text-gray-500 sm:text-xl dark:text-gray-400'>
              Check out some of my most recent posts
            </p>
          </div>
          <div className='grid gap-8 lg:grid-cols-2'>
            <RecentPosts initialPosts={initialPosts ?? []} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
