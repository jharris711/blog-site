import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import BlogList from '@/components/BlogList';

type Comment = Database['public']['Tables']['comments']['Row'];
type Like = Database['public']['Tables']['likes']['Row'];
type Post = Database['public']['Tables']['blogs']['Row'];

const BlogListPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const { data: posts } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });
  const { data: comments } = await supabase.from('comments').select('*');
  const { data: likes } = await supabase.from('likes').select('*');

  return (
    <section className='darK:text-gray-400 dark:bg-gray-900 body-font overflow-hidden'>
      <div className='container px-5 py-24 mx-auto'>
        <div className='flex flex-wrap -m-12'>
          <BlogList
            initialPosts={(posts as Post[]) ?? []}
            initialComments={(comments as Comment[]) ?? []}
            initialLikes={(likes as Like[]) ?? []}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogListPage;
