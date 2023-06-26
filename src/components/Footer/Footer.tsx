'use client';
import CubeIcon from '@/svgIcons/CubeIcon';
import FacebookIcon from '@/svgIcons/FacebookIcon';
import GithubIcon from '@/svgIcons/GithubIcon';
import LinkedInIcon from '@/svgIcons/LinkedInIcon';
import TwitterIcon from '@/svgIcons/TwitterIcon';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const signin = pathname === '/auth/signin';
  const signup = pathname === '/auth/signup';

  return (
    <footer
      className={`dark:text-gray-400 dark:bg-gray-900 bg-gray-100 body-font sticky bottom-0 shadow`}
    >
      <div className='container px-5 py-4 mx-auto flex items-center sm:flex-row flex-col'>
        <a
          href='/'
          className='flex title-font font-medium items-center text-gray-900 dark:text-gray-100 mb-4 md:mb-0'
        >
          <CubeIcon className='w-10 h-10 text-white p-2 bg-indigo-500 rounded-full' />
          <span className='ml-3 text-xl'>J. Harris Web Dev</span>
        </a>
        <p className='text-sm text-gray-400 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-indigo-500 sm:py-2 sm:mt-0 mt-4'>
          © 2023 J. Harris Web Dev —
          <a
            href='https://twitter.com/jheeeeezy'
            className='text-gray-500 ml-1 hover:text-indigo-500'
            target='_blank'
            rel='noopener noreferrer'
          >
            @jheeeeezy
          </a>
        </p>
        <span className='inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start'>
          <a
            href='https://www.facebook.com/jharriswebdev'
            target='_blank'
            className='text-gray-400 hover:text-indigo-500'
          >
            <FacebookIcon className='w-5 h-5' />
          </a>
          <a
            href='https://twitter.com/jheeeeezy'
            target='_blank'
            className='ml-3 text-gray-400 hover:text-indigo-500'
          >
            <TwitterIcon className='w-5 h-5' />
          </a>
          <a
            href='https://github.com/jharris711'
            target='_blank'
            className='ml-3 text-gray-400 hover:text-indigo-500'
          >
            <GithubIcon className='w-5 h-5' />
          </a>
          <a
            href='https://www.linkedin.com/in/joshsharris/'
            target='_blank'
            className='ml-3 text-gray-400 hover:text-indigo-500'
          >
            <LinkedInIcon className='w-5 h-5' />
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
