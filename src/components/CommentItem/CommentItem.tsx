import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import DropDown from '../DropDown';
import ConfirmIcon from '@/svgIcons/ConfirmIcon';

type Comment = Database['public']['Tables']['comments']['Row'];
interface Props {
  notFirst: boolean;
  comment: Comment;
  session?: Session | null;
}

const CommentItem = ({ notFirst, comment, session }: Props) => {
  const ref = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const supabase = createClientComponentClient<Database>();

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = new FormData(ref.current);
    const newComment = formData.get('comment')?.toString() || '';

    const { error } = await supabase
      .from('comments')
      .update({
        content: newComment,
        updated_at: dayjs(Date.now()).format(),
      })
      .eq('id', comment.id);

    if (error) throw error;

    setEditing(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', comment.id);

    if (error) throw error;
  };

  return (
    <article
      className={`p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900 ${
        notFirst ? 'border-t border-gray-200 dark:border-gray-700' : ''
      }`}
    >
      <footer className='flex justify-between items-center mb-2'>
        <div className='flex items-center'>
          <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white'>
            <a href='/'>
              <span className='inline-flex mr-2 items-center justify-center h-8 w-8 rounded-full bg-gray-600'>
                <span className='text-xs font-medium text-white leading-none'>
                  {comment.username ? comment.username[0] : ''}
                </span>
              </span>
            </a>
            {comment.username}
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <time
              dateTime={dayjs(comment.created_at).format('YYYY-MM-DD')}
              title={dayjs(comment.created_at).format('MMMM DD, YYYY')}
            >
              {dayjs(comment.created_at).format('MMM. D, YYYY')}
            </time>
          </p>
        </div>
        <DropDown
          author_id={comment.user_id}
          session={session}
          setEditing={setEditing}
          handleDelete={handleDelete}
        />
      </footer>
      {editing ? (
        <form ref={ref}>
          <textarea
            id='comment'
            name='comment'
            rows={2}
            className='p-2 w-full rounded-lg text-sm text-gray-900 border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800'
            defaultValue={comment.content ?? 'Leave a new comment'}
            placeholder={comment.content ?? 'Leave a new comment'}
            required
          />
        </form>
      ) : (
        <p>{comment.content}</p>
      )}
      {/* Reply Button */}
      <div className='flex items-center mt-4 space-x-4'>
        {editing ? (
          <button
            onClick={handleUpdate}
            type='submit'
            className='flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400'
          >
            <ConfirmIcon aria-hidden='true' className='mr-1 w-4 h-4' />
            Confirm Edit
          </button>
        ) : (
          <></>
          /* <button
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
              />
            </svg>
            Reply
          </button> */
        )}
      </div>
      {/* End Reply Button */}
    </article>
  );
};

export default CommentItem;
