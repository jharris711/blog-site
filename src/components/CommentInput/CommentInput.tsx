'use client';
import { useRef } from 'react';
import {
  createClientComponentClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface Props {
  session: Session | null;
  blog_id: string;
  user_id?: string;
  username?: string | null;
  email?: string | null;
}

const CommentInput = ({
  blog_id,
  session,
  user_id,
  username,
  email,
}: Props) => {
  const ref = useRef<HTMLFormElement>(null);
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ref.current) return;
    const formData = new FormData(ref.current);
    const comment = formData.get('comment')?.toString();

    const { error } = await supabase.from('comments').insert({
      content: comment,
      blog_id,
      user_id,
      username,
      email,
    });

    if (error) throw error;

    ref.current.reset();
  };

  return (
    <>
      <form className='mb-6' ref={ref} onSubmit={handleSubmit}>
        <div className='py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
          <label htmlFor='comment' className='sr-only'>
            Your comment
          </label>
          <textarea
            id='comment'
            name='comment'
            rows={6}
            className='px-0 w-full text-sm text-gray-900 border-0 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800'
            placeholder={
              session ? 'Write a comment...' : 'Sign in to leave a comment'
            }
            required
          />
        </div>
        <button
          type='submit'
          className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-indigo-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-indigo-800'
        >
          Post comment
        </button>
      </form>
    </>
  );
};

export default CommentInput;
