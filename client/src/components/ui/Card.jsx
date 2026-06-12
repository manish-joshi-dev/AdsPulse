export const Card = ({ children, padding = 'md', elevated = false, className = '' }) => {
  const paddings = { sm: 'p-3', md: 'p-5', lg: 'p-8' };
  return (
    <div className={`bg-white rounded-xl border border-zinc-200 transition-shadow ${elevated ? 'shadow-lg hover:shadow-xl' : 'shadow-sm'} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};
