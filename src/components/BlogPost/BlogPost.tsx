'use client';
import {
  createClientComponentClient,
  Session,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import sdk, { VM } from '@stackblitz/sdk';
import useFormatMarkdown from '@/hooks/useFormatMarkdown';
import CommentBubbleIcon from '@/svgIcons/CommentBubbleIcon';
import LikeButton from '../LikeButton';

type Like = Database['public']['Tables']['likes']['Row'];
type Post = Database['public']['Tables']['blogs']['Row'];

interface Props {
  id: string;
  initialContent: string;
  initialPost: Post;
  session: Session | null;
  children?: React.ReactNode;
  initialLike?: Like | null;
  initialTotalLikes?: number | null;
}

const BlogPost = ({
  id,
  initialContent,
  initialPost,
  session,
  children,
  initialLike,
  initialTotalLikes,
}: Props) => {
  const [postData, setPostData] = useState<Post | null>(initialPost);
  const [content, setContent] = useState<string>(initialContent);
  const [vmInstance, setVMInstance] = useState<VM>();
  const { formattedPost } = useFormatMarkdown(content);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getFileContent = async (fileName: string) => {
      const { data: file } = await supabase.storage
        .from('blogs')
        .download(fileName);

      return { content: await file!.text() };
    };

    const channel = supabase
      .channel('realtime post')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'blogs',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setPostData(payload.new as Post);

          getFileContent(payload.new.file_name as string)
            .then((res) => {
              setContent(res.content);
            })
            .catch((err) => console.log(err));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, id]);

  useEffect(() => {
    if (
      !postData ||
      !postData.stackblitz_element_id ||
      !postData.stackblitz_project_id
    )
      return;
    const embedProject = async () => {
      const res = await sdk.embedProjectId(
        postData.stackblitz_element_id as string,
        postData.stackblitz_project_id as string,
        { clickToLoad: true }
      );
      setVMInstance(res);
    };
    embedProject();
  }, [postData]);

  return (
    <main className='pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900'>
      <div className='flex justify-between px-4 mx-auto max-w-screen'>
        <article className='mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert'>
          <header className='mb-4 lg:mb-6 not-format'>
            <address className='flex items-center mb-6 not-italic'>
              <div className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white'>
                <img
                  className='mr-4 w-16 h-16 rounded-full'
                  src={postData?.author_img_url}
                  alt='J. Harris'
                />
                <div>
                  <a
                    href='#'
                    rel='author'
                    className='text-xl font-bold text-gray-900 dark:text-white'
                  >
                    {postData?.author}
                  </a>
                  <p className='text-base font-light text-gray-500 dark:text-gray-400'>
                    Full-Stack Web and Software Developer
                  </p>
                  <p className='text-base font-light text-gray-500 dark:text-gray-400'>
                    <time dateTime='2022-02-08' title='February 8th, 2022'>
                      {dayjs(postData?.created_at).format('MMM. D, YYYY')}
                    </time>
                  </p>
                </div>
              </div>
            </address>
            <LikeButton
              session={session}
              blog_id={id}
              initialLike={initialLike}
              initialTotalLikes={initialTotalLikes}
            />
            <a href='#comment-section-jump'>
              <button className='inline-flex items-center bg-indigo-500 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 rounded text-base mt-4 md:mt-0'>
                <span className='text-gray-200 inline-flex items-center leading-none text-sm'>
                  <CommentBubbleIcon className='w-4 h-4 mr-2' />
                  Comment
                </span>
              </button>
            </a>
            <h1 className='mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white'>
              {postData?.title}
            </h1>
          </header>
          {postData?.main_img_url ? (
            <>
              <br />
              <figure>
                <img src={postData.main_img_url} alt='' />
                {/* <figcaption className='text-xs text-center'>
                  tw-noti demo screen
                </figcaption> */}
              </figure>
            </>
          ) : (
            <></>
          )}

          {postData?.stackblitz_element_id ? (
            <>
              <br />
              <div id={postData?.stackblitz_element_id} />
            </>
          ) : (
            <></>
          )}
          {/* Content */}
          <br />
          <div
            dangerouslySetInnerHTML={{ __html: formattedPost }}
            className='prose md:prose-lg dark:text-gray-100'
          />
          <br />
          <div id='comment-section-jump' />
          {/* End Content */}
          {/* CommentSection component passed as child here 
            so the layout of CommentSection can be a server component */}
          {children}
        </article>
      </div>
    </main>
  );
};

export default BlogPost;
