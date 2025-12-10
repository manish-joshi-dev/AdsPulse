import { ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { HealthScore } from "../components/HealthScore.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useDeleteReport, useReports, useReportSummary } from "../hooks/useReports.js";
import { formatCurrency, formatDate, formatNumber } from "../utils/formatters.js";

export const Reports = () => {
  const { setActiveReport } = useAppContext();
  const { data: reports = [], isLoading } = useReports();
  const { data: summary } = useReportSummary();
  const deleteMutation = useDeleteReport();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="panel p-6">
          <p className="text-sm font-medium uppercase text-zinc-500">Report history</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Saved diagnostics</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg bg-cloud p-4">
              <p className="text-sm text-zinc-500">Reports</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{summary?.count || 0}</p>
            </div>
            <div className="rounded-lg bg-cloud p-4">
              <p className="text-sm text-zinc-500">Avg. score</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{summary?.averageScore || 0}</p>
            </div>
            <div className="rounded-lg bg-cloud p-4">
              <p className="text-sm text-zinc-500">Spend</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{formatCurrency(summary?.totalSpend || 0)}</p>
            </div>
          </div>
        </section>

        {summary?.latestReport ? (
          <HealthScore score={summary.latestReport.performanceScore} grade={summary.latestReport.grade} />
        ) : (
          <section className="panel flex min-h-64 items-center justify-center p-6 text-sm text-zinc-500">
            No saved reports.
          </section>
        )}
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-zinc-200 p-6">
          <h2 className="text-xl font-semibold text-ink">Reports</h2>
        </div>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-lg bg-cloud" />
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {reports.map((report) => (
              <article key={report.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-ink">{report.sourceFile}</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatDate(report.createdAt)} - {formatNumber(report.rowCount)} rows - Grade {report.grade}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-signal/10 px-3 py-1 text-sm font-semibold text-signal">
                    {report.performanceScore}
                  </span>
                  <Link
                    to={`/reports/${report.id}`}
                    onClick={() => setActiveReport(report)}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 hover:bg-cloud"
                    aria-label={`Open ${report.sourceFile}`}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(report.id)}
                    disabled={deleteMutation.isPending}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 text-rose hover:bg-rose/10 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Delete ${report.sourceFile}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-6 text-sm text-zinc-500">No reports saved.</p>
        )}
      </section>
    </div>
  );
};
