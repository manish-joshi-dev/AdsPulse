export const Badge = ({ variant = 'neutral', size = 'md', children, className = '' }) => {
  const variants = {
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    critical: 'bg-rose-100 text-rose-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-zinc-100 text-zinc-800'
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
