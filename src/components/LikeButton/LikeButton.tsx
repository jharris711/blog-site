'use client';
import { useEffect, useState } from 'react';
import ThumbsUpIcon from '@/svgIcons/ThumbsUpIcon';
import {
  createClientComponentClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Like = Database['public']['Tables']['likes']['Row'];

interface Props {
  session: Session | null;
  blog_id: string;
  initialLike?: Like | null;
  initialTotalLikes?: number | null;
}

const LikeButton = ({
  session,
  blog_id,
  initialLike,
  initialTotalLikes,
}: Props) => {
  const [totalLikes, setTotalLikes] = useState<number | null | undefined>(
    initialTotalLikes
  );
  const [like, setLike] = useState<Like | null | undefined>(initialLike);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const channel = supabase
      .channel('realtime likes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'likes',
          filter: `blog_id=eq.${blog_id}`,
        },
        (payload) => {
          if (payload.new.user_id !== session?.user.id) return;
          setLike(payload.new as Like);
          setTotalLikes((totalLikes) => (totalLikes ?? 0) + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'likes',
          filter: `blog_id=eq.${blog_id}`,
        },
        (payload) => {
          if (payload.old.id !== like?.id) return;
          setLike(null);
          setTotalLikes((totalLikes) => (totalLikes ?? 0) - 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, like, blog_id, session?.user.id]);

  const handleLike = async () => {
    if (like) {
      await supabase.from('likes').delete().eq('id', like.id);
      return;
    }
    await supabase.from('likes').insert({
      user_id: session?.user.id,
      blog_id,
    });
    return;
  };

  return (
    <button
      onClick={handleLike}
      className='inline-flex items-center bg-indigo-500 border-0 py-1 px-3 mb-4 mr-2 focus:outline-none hover:bg-indigo-600 rounded text-base mt-4 md:mt-0'
    >
      <span className=' text-gray-200 inline-flex items-center leading-none text-sm'>
        <ThumbsUpIcon className='w-4 h-4 mr-2' fill={like ? true : false} />
        Like {totalLikes ?? 0}
      </span>
    </button>
  );
};

export default LikeButton;
