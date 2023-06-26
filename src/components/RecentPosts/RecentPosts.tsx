'use client';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ArrowRight from '@/svgIcons/ArrowRight';
import ArticleIcon from '@/svgIcons/ArticleIcon';
import TutorialIcon from '@/svgIcons/TutorialIcon';
import { Database } from '@/types/supabase';

type Post = Database['public']['Tables']['blogs']['Row'];
interface Props {
  initialPosts: Post[];
}

const RecentPosts = ({ initialPosts }: Props) => {
  const tutorial = 'tutorial';
  dayjs.extend(relativeTime);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
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
        },
        (payload) => {
          setPosts([payload.new as Post, ...posts]);
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
  }, [supabase, posts]);

  if (posts.length)
    return (
      <>
        {posts.map((post) => {
          const { id, created_at, blog_type, title, description, author } =
            post;
          return (
            <article
              key={id}
              className='p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700'
            >
              <div className='flex justify-between items-center mb-5 text-gray-500'>
                <span className='bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800'>
                  {blog_type === tutorial ? (
                    <TutorialIcon className='mr-1 w-3 h-3' />
                  ) : (
                    <ArticleIcon className='mr-1 w-3 h-3' />
                  )}
                  {blog_type?.toUpperCase()}
                </span>
                <span className='text-sm'>{dayjs(created_at).fromNow()}</span>
              </div>
              <h2 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                <a href={`/blogs/${id}`}>{title}</a>
              </h2>
              <p className='mb-5 font-light text-gray-500 dark:text-gray-400'>
                {description}
              </p>
              <div className='flex justify-between items-center'>
                <div className='flex items-center space-x-4'>
                  <span className='inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-600'>
                    <span className='text-xs font-medium text-white leading-none'>
                      {author![0]}
                    </span>
                  </span>
                  <span className='font-medium dark:text-white'>{author}</span>
                </div>
                <a
                  href={`/blogs/${id}`}
                  className='inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline'
                >
                  Read more
                  <ArrowRight className='ml-2 w-4 h-4' />
                </a>
              </div>
            </article>
          );
        })}
      </>
    );

  return (
    <>
      {[1, 2].map((n) => {
        return (
          <div
            key={n}
            className='min-h-[15rem] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]'
          >
            <div className='flex flex-auto flex-col justify-center items-center p-4 md:p-5'>
              <div className='flex justify-center'>
                <div
                  className='animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full'
                  role='status'
                  aria-label='loading'
                >
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RecentPosts;
