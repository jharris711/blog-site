import { useEffect, useState, useCallback } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import matter from 'gray-matter';

const useFormatMarkdown = (blog: string | null) => {
  const [formattedPost, setFormattedPost] = useState<string>('');
  const [postMetaData, setPostMetaData] = useState<any>();

  const addTailwindClasses = useCallback((htmlString: string) => {
    const container = document.createElement('div');
    container.innerHTML = htmlString;

    const elementsToAdd = container.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, strong, a'
    );

    elementsToAdd.forEach((el) => {
      if (el.hasAttribute('href')) {
        el.setAttribute('target', '_blank');
      }
      if (el.nodeName === 'STRONG') {
        el.classList.add('dark:text-indigo-400', 'text-indigo-700', 'text-lg');
      } else {
        el.classList.add('dark:text-gray-300');
      }
    });

    const breaks = container.querySelectorAll('br, hr');
    breaks.forEach((el) => {
      el.classList.add('border-indigo-500');
    });

    const codeElements = container.querySelectorAll('code');

    codeElements.forEach((el) => {
      const El = el as HTMLElement;
      const wrapper = document.createElement('div');
      El.style.backgroundColor = 'rgba(55, 65, 81, 1)';
      El.style.color = '#fff';
      El.style.width = '100%';

      wrapper.classList.add(
        'inline-flex',
        'text-left',
        'text-gray-800',
        'dark:text-white',
        'dark:bg-gray-700',
        'w-auto',
        'text-sm',
        'sm:text-base',
        'inline-flex',
        'rounded-lg',
        'p-1',
        'items-center',
        'space-x-4'
      );
      if (!el.parentNode) return;
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    });

    const preElements = container.querySelectorAll('pre');

    preElements.forEach((el) => {
      const El = el as HTMLElement;
      const wrapper = document.createElement('div');
      El.style.backgroundColor = 'rgba(55, 65, 81, 1)';
      El.style.color = '#fff';
      El.style.width = '100%';

      wrapper.classList.add('w-full', 'rounded-lg');
      if (!el.parentNode) return;
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    });

    const updatedHtmlString = container.innerHTML;
    return { updatedHtmlString };
  }, []);

  useEffect(() => {
    if (!blog) return;

    const formatPost = async (content: string) => {
      const matterResult = matter(content);

      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

      const contentHtml = processedContent.toString();

      return {
        formattedPost: contentHtml,
        metadata: matterResult.data,
      };
    };

    formatPost(blog).then((result) => {
      const { updatedHtmlString } = addTailwindClasses(result.formattedPost);
      setFormattedPost(updatedHtmlString);
      setPostMetaData(result.metadata);
    });
  }, [blog, addTailwindClasses]);

  return { formattedPost, postMetaData };
};

export default useFormatMarkdown;
