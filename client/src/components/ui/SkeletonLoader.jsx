export const SkeletonLoader = ({ variant = 'text', className = '' }) => {
  const variants = {
    text: 'h-4 w-full rounded',
    card: 'h-48 w-full rounded-lg',
    'table-row': 'h-12 w-full rounded',
    gauge: 'h-32 w-32 rounded-full'
  };
  return <div className={`animate-pulse bg-zinc-200 ${variants[variant]} ${className}`} />;
};
