'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import ArrowRight from '@/svgIcons/ArrowRight';
import CommentBubbleIcon from '@/svgIcons/CommentBubbleIcon';
import ThumbsUpIcon from '@/svgIcons/ThumbsUpIcon';

type Comment = Database['public']['Tables']['comments']['Row'];
type Like = Database['public']['Tables']['likes']['Row'];
type Post = Database['public']['Tables']['blogs']['Row'];
interface Props {
  initialPosts: Post[];
  initialComments: Comment[];
  initialLikes: Like[];
}

const BlogList = ({ initialPosts, initialComments, initialLikes }: Props) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [likes, setLikes] = useState<Like[]>(initialLikes);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const postsChannel = supabase
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

    const commentsChannel = supabase
      .channel('realtime comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
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
        },
        (payload) => {
          const updatedComments = comments.filter(
            (comment) => comment.id !== payload.old.id
          );
          setComments(updatedComments);
        }
      )
      .subscribe();

    const likesChannel = supabase
      .channel('realtime likes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'likes',
        },
        (payload) => {
          setLikes([payload.new as Like, ...likes]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'likes',
        },
        (payload) => {
          const i = comments.findIndex((el) => el.id === payload.new.id);
          if (i !== -1) {
            const newList = [...likes];
            newList[i] = payload.new as Like;
            setLikes(newList);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'likes',
        },
        (payload) => {
          const updatedLikes = likes.filter(
            (like) => like.id !== payload.old.id
          );
          setLikes(updatedLikes);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(postsChannel);
    };
  }, [supabase, comments, likes, posts]);

  return (
    <>
      {posts.map((post: Post) => {
        const totalComments = comments.filter(
          (comment) => comment.blog_id === post.id
        ).length;
        const totalLikes = likes.filter(
          (like) => like.blog_id === post.id
        ).length;

        return (
          <div
            key={post.id}
            className='p-12 md:w-1/2 flex flex-col items-start'
          >
            <span className='inline-block py-1 px-2 rounded dark:bg-gray-800 bg-indigo-200 dark:text-gray-400 text-opacity-75 text-xs font-medium tracking-widest'>
              {post.tag}
            </span>
            <a href={`/blogs/${post.id}`}>
              <h2 className='sm:text-3xl text-2xl title-font font-medium dark:text-white mt-4 mb-4'>
                {post.title}
              </h2>
            </a>
            <p className='leading-relaxed mb-8'>{post.description}</p>
            <div className='flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-800 border-opacity-75 mt-auto w-full'>
              <a
                href={`/blogs/${post.id}`}
                className='dark:text-indigo-400 text-indigo-600 inline-flex items-center'
              >
                Learn More
                <ArrowRight className='w-4 h-4 ml-2' />
              </a>
              <span className='text-gray-500 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-800'>
                <ThumbsUpIcon className='w-4 h-4 mr-1' />
                {totalLikes}
              </span>
              <span className='text-gray-500 inline-flex items-center leading-none text-sm'>
                <CommentBubbleIcon className='w-4 h-4 mr-1' />
                {totalComments}
              </span>
            </div>
            <a className='inline-flex items-center'>
              <img
                alt='blog'
                src={post.author_img_url}
                className='w-12 h-12 rounded-full flex-shrink-0 object-cover object-center'
              />
              <span className='flex-grow flex flex-col pl-4'>
                <span className='title-font font-medium dark:text-white'>
                  {post.author}
                </span>
                <span className='text-gray-500 text-xs tracking-widest mt-0.5'>
                  FULL-STACK DEVELOPER
                </span>
              </span>
            </a>
          </div>
        );
      })}
    </>
  );
};

export default BlogList;
