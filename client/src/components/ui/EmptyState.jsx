import { Button } from './Button';

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    {Icon && <Icon className="mb-4 h-12 w-12 text-zinc-300" />}
    <h3 className="text-lg font-semibold text-ink">{title}</h3>
    <p className="mt-1 max-w-sm text-zinc-500">{description}</p>
    {onAction && (
      <Button className="mt-6" onClick={onAction}>{actionText}</Button>
    )}
  </div>
);
