export const TooltipWrapper = ({ children, title }) => (
  <div className="group relative flex w-max">
    {children}
    <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-ink px-2 py-1 text-xs text-white group-hover:block">
      {title}
    </div>
  </div>
);
