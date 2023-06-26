import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import BlogPost from '@/components/BlogPost';
import CommentSection from '@/components/CommentSection';
import RelatedArticles from '@/components/RelatedArticles';
import SubscribeForm from '@/components/SubscribeForm';
import { Database } from '@/types/supabase';

type Like = Database['public']['Tables']['likes']['Row'];
type Post = Database['public']['Tables']['blogs']['Row'];
interface Props {
  params: { id: string };
}

const BlogPage = async ({ params }: Props) => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const { data: post } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', params.id)
    .single();

  const { data: relatedPosts } = await supabase
    .from('blogs')
    .select('*')
    .eq('tag', post?.tag)
    .limit(4)
    .neq('id', params.id);

  const { data: file } = await supabase.storage
    .from('blogs')
    .download(post?.file_name as string);
  const blogContent = await file!.text();

  const { data: like } = await supabase
    .from('likes')
    .select('*')
    .eq('blog_id', params.id)
    .eq('user_id', session?.user.id)
    .single();

  const { count: initialTotalLikes } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('blog_id', params.id);

  console.log(like);

  return (
    <>
      <BlogPost
        session={session}
        initialPost={post as Post}
        initialContent={blogContent}
        id={params.id}
        initialLike={like as Like}
        initialTotalLikes={initialTotalLikes}
      >
        {/* CommentSection component passed as child here 
        so the layout of CommentSection can be a server component */}
        <CommentSection id={params.id} session={session} />
      </BlogPost>

      <RelatedArticles
        relatedPosts={(relatedPosts as Post[]) ?? []}
        tag={post?.tag}
      />

      <section className='bg-white dark:bg-gray-900'>
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
          <div className='mx-auto max-w-screen-md sm:text-center'>
            <h2 className='mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white'>
              Sign up for our newsletter
            </h2>
            <p className='mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400'>
              Stay up to date with the roadmap progress, announcements and
              exclusive discounts feel free to sign up with your email.
            </p>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
