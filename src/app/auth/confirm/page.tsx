import CubeIcon from '@/svgIcons/CubeIcon';

const confirmPage = () => {
  return (
    <>
      <section className='bg-gray-50 dark:bg-gray-900  p-8 '>
        <div className='flex flex-col items-center px-6 py-8 mx-auto h-screen text-center'>
          <a
            href='#'
            className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'
          >
            <CubeIcon className='w-10 h-10 text-white p-2 bg-indigo-500 rounded-full mr-3' />
            J. Harris Web Dev
          </a>
          <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                Thanks for signing up
              </h1>
              <h3>Check the email you provided for a confirmation link</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default confirmPage;
