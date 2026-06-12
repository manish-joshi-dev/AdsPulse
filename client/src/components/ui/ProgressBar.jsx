export const ProgressBar = ({ progress, stepLabel }) => (
  <div className="w-full">
    {stepLabel && <p className="mb-1 text-sm font-medium">{stepLabel}</p>}
    <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
      <div 
        className="h-full bg-signal transition-all duration-500" 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
      />
    </div>
    <p className="mt-1 text-xs text-zinc-500 text-right">{Math.round(progress)}%</p>
  </div>
);
