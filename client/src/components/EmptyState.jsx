import { BarChart3 } from "lucide-react";

export const EmptyState = () => (
  <section className="panel flex min-h-96 items-center justify-center p-8 text-center">
    <div className="max-w-md">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-signal/10 text-signal">
        <BarChart3 className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold text-ink">No report selected</h2>
      <p className="mt-2 text-sm text-zinc-500">Upload a CSV or open a previous report.</p>
    </div>
  </section>
);

