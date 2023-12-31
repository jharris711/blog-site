const ArrowRight = ({ className }: { className?: string }) => {
  return (
    <svg
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      className={className}
      viewBox='0 0 24 24'
    >
      <path d='M5 12h14M12 5l7 7-7 7'></path>
    </svg>
  );
};

export default ArrowRight;
