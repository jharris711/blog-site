const CommentCounter = ({ count }: { count: number }) => {
  return (
    <div className='flex justify-between items-center mb-6'>
      <h2 className='text-lg lg:text-2xl font-bold text-gray-900 dark:text-white'>
        Discussion ({count})
      </h2>
    </div>
  );
};

export default CommentCounter;
