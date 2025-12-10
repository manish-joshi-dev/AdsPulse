import clsx from "clsx";

export const MetricCard = ({ label, value, helper, icon: Icon, tone = "text-signal" }) => (
  <article className="panel min-h-32 p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-500">{label}</p>
        <p className="mt-3 break-words text-2xl font-semibold text-ink">{value}</p>
      </div>
      {Icon ? (
        <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100", tone)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : null}
    </div>
    {helper ? <p className="mt-4 text-sm text-zinc-500">{helper}</p> : null}
  </article>
);

