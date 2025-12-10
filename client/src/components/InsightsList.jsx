import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { priorityOrder } from "../types/analysis.js";

const priorityClass = (priority) => {
  if (priority === "High") return "border-rose/20 bg-rose/10 text-rose";
  if (priority === "Medium") return "border-amber/25 bg-amber/10 text-amber";
  return "border-signal/20 bg-signal/10 text-signal";
};

export const InsightsList = ({ recommendations = [] }) => {
  const sorted = [...recommendations].sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );

  return (
    <section className="panel p-6">
      <div className="mb-5">
        <p className="text-sm font-medium uppercase text-zinc-500">Actions</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">Recommended fixes</h2>
      </div>
      <div className="space-y-4">
        {sorted.length > 0 ? (
          sorted.map((item) => (
            <article key={`${item.title}-${item.priority}`} className="rounded-lg border border-zinc-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="max-w-xl text-base font-semibold text-ink">{item.title}</h3>
                <span className={clsx("rounded-full border px-2.5 py-1 text-xs font-semibold", priorityClass(item.priority))}>
                  {item.priority}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{item.rationale}</p>
              <ul className="mt-4 space-y-2">
                {(item.actionItems || []).slice(0, 4).map((action) => (
                  <li key={action} className="flex gap-2 text-sm text-zinc-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-medium text-ink">{item.expectedImpact}</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg bg-cloud p-4 text-sm text-zinc-500">No recommendations returned.</p>
        )}
      </div>
    </section>
  );
};

