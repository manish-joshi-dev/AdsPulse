import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { HealthScore } from "../components/HealthScore.jsx";
import { ReportOverview } from "../components/ReportOverview.jsx";
import { useReport } from "../hooks/useReports.js";
import { formatDate, formatNumber } from "../utils/formatters.js";

export const ReportDetail = () => {
  const { id } = useParams();
  const { data: report, isLoading, error } = useReport(id);

  if (isLoading) {
    return <section className="panel min-h-96 animate-pulse p-8" />;
  }

  if (error) {
    return (
      <section className="panel p-8">
        <h1 className="text-2xl font-semibold text-ink">Report unavailable</h1>
        <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
        <Link to="/reports" className="focus-ring mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Reports
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/reports" className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-ink hover:bg-white">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Reports
      </Link>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <HealthScore score={report.performanceScore} grade={report.grade} />
        <section className="panel flex min-h-64 flex-col justify-between p-6">
          <div>
            <p className="text-sm font-medium uppercase text-zinc-500">Report</p>
            <h1 className="mt-2 break-words text-3xl font-semibold text-ink">{report.sourceFile}</h1>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-cloud p-4">
              <p className="text-sm text-zinc-500">Rows</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{formatNumber(report.rowCount)}</p>
            </div>
            <div className="rounded-lg bg-cloud p-4">
              <p className="text-sm text-zinc-500">Campaigns</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{formatNumber(report.campaigns?.length || 0)}</p>
            </div>
            <div className="rounded-lg bg-cloud p-4">
              <p className="text-sm text-zinc-500">Created</p>
              <p className="mt-2 text-base font-semibold text-ink">{formatDate(report.createdAt)}</p>
            </div>
          </div>
        </section>
      </div>

      <ReportOverview report={report} />
    </div>
  );
};

