import { cookies } from 'next/headers';
import {
  Session,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import CommentList from '../CommentList';
import { Database } from '@/types/supabase';

interface Props {
  id: string;
  session: Session | null;
}

const CommentSection = async ({ id, session }: Props) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .match({ blog_id: id })
    .order('created_at', { ascending: false });

  const { data: user } = await supabase
    .from('profiles')
    .select('username')
    .match({ id: session?.user.id })
    .single();

  return (
    <section className='not-format'>
      <CommentList
        blog_id={id}
        initialComments={comments ?? []}
        session={session}
        user={user?.username ?? ''}
      />
    </section>
  );
};

export default CommentSection;
