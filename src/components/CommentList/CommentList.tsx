'use client';
import { useEffect, useState } from 'react';
import {
  createClientComponentClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import CommentCounter from '../CommentCounter';
import CommentInput from '../CommentInput';
import CommentItem from '../CommentItem';

type Comment = Database['public']['Tables']['comments']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
interface Props {
  blog_id: string;
  initialComments: Comment[];
  session: Session | null;
  user: Profile['username'];
}

const CommentList = ({ blog_id, initialComments, session, user }: Props) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const channel = supabase
      .channel('realtime comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `blog_id=eq.${blog_id}`,
        },
        (payload) => {
          setComments([payload.new as Comment, ...comments]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comments',
          filter: `blog_id=eq.${blog_id}`,
        },
        (payload) => {
          const i = comments.findIndex((el) => el.id === payload.new.id);
          if (i !== -1) {
            const newList = [...comments];
            newList[i] = payload.new as Comment;
            setComments(newList);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `blog_id=eq.${blog_id}`,
        },
        (payload) => {
          const updatedComments = comments.filter(
            (comment) => comment.id !== payload.old.id
          );
          setComments(updatedComments);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, blog_id, comments, setComments]);

  return (
    <>
      <CommentCounter count={comments.length} />
      <CommentInput
        blog_id={blog_id}
        email={session?.user.email}
        session={session}
        user_id={session?.user.id}
        username={user}
      />
      {comments.map((comment, i) => {
        const notFirst = i !== 0;
        const replyClasses = 'ml-6 lg:ml-12';

        return (
          <>
            <CommentItem
              notFirst={notFirst}
              comment={comment}
              session={session}
            />
            {/* Reply */}
            {/* <article className='p-6 mb-6 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900'>
              <footer className='flex justify-between items-center mb-2'>
                <div className='flex items-center'>
                  <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white'>
                    <img
                      className='mr-2 w-6 h-6 rounded-full'
                      src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                      alt='Jese Leos'
                    />
                    Jese Leos
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <time dateTime='2022-02-12' title='February 12th, 2022'>
                      Feb. 12, 2022
                    </time>
                  </p>
                </div>
                <button
                  id='dropdownComment2Button'
                  data-dropdown-toggle='dropdownComment2'
                  className='inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
                  type='button'
                >
                  <svg
                    className='w-5 h-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z'></path>
                  </svg>
                  <span className='sr-only'>Comment settings</span>
                </button>
                <div
                  id='dropdownComment2'
                  className='hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600'
                >
                  <ul
                    className='py-1 text-sm text-gray-700 dark:text-gray-200'
                    aria-labelledby='dropdownMenuIconHorizontalButton'
                  >
                    <li>
                      <a
                        href='#'
                        className='block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                      >
                        Remove
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                      >
                        Report
                      </a>
                    </li>
                  </ul>
                </div>
              </footer>
              <p>Much appreciated! Glad you liked it ☺️</p>
              <div className='flex items-center mt-4 space-x-4'>
                <button
                  type='button'
                  className='flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400'
                >
                  <svg
                    aria-hidden='true'
                    className='mr-1 w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    ></path>
                  </svg>
                  Reply
                </button>
              </div>
            </article> */}
            {/* End Reply */}
          </>
        );
      })}
    </>
  );
};

export default CommentList;
