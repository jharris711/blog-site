'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Post = Database['public']['Tables']['blogs']['Row'];
interface Props {
  relatedPosts: Post[];
  tag: string;
}

const RelatedArticles = ({ relatedPosts, tag }: Props) => {
  const [posts, setPosts] = useState<Post[]>(relatedPosts);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const channel = supabase
      .channel('realtime posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blogs',
          filter: `tag=eq.${tag}`,
        },
        (payload) => {
          const temp = posts;
          if (temp.length === 4) {
            temp.pop();
          }
          setPosts([payload.new as Post, ...temp]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'blogs',
        },
        (payload) => {
          const i = posts.findIndex((el) => el.id === payload.new.id);
          if (i !== -1) {
            const newList = [...posts];
            newList[i] = payload.new as Post;
            setPosts(newList);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'blogs',
        },
        (payload) => {
          const updatedPosts = posts.filter(
            (post) => post.id !== payload.old.id
          );
          setPosts(updatedPosts);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, posts, tag]);

  return (
    <aside
      aria-label='Related articles'
      className='py-8 lg:py-24 bg-gray-50 dark:bg-gray-800'
    >
      <div className='px-4 mx-auto max-w-screen-xl'>
        <h2 className='mb-8 text-2xl font-bold text-gray-900 dark:text-white'>
          Related articles
        </h2>
        <div className='grid gap-12 sm:grid-cols-2 lg:grid-cols-4'>
          {posts.map((post) => {
            return (
              <article key={post.id} className='max-w-xs'>
                <a href={`/blogs/${post.id}`}>
                  <img
                    src={post.main_img_url ?? ''}
                    className='mb-5 rounded-lg'
                    alt='Image 1'
                  />
                </a>
                <h2 className='mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white'>
                  <a href={`/blogs/${post.id}`}>{post.title}</a>
                </h2>
                <p className='mb-4 font-light text-gray-500 dark:text-gray-400'>
                  {post.description}
                </p>
                <a
                  href={`/blogs/${post.id}`}
                  className='inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline'
                >
                  Read{/*  in 2 minutes */}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default RelatedArticles;
