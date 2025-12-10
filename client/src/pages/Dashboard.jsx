import { motion } from "framer-motion";
import { CalendarDays, FileSpreadsheet } from "lucide-react";
import { EmptyState } from "../components/EmptyState.jsx";
import { HealthScore } from "../components/HealthScore.jsx";
import { ReportOverview } from "../components/ReportOverview.jsx";
import { UploadDropzone } from "../components/UploadDropzone.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useReports, useReportSummary } from "../hooks/useReports.js";
import { useUploadAnalysis } from "../hooks/useUploadAnalysis.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

export const Dashboard = () => {
  const { activeReport, setActiveReport } = useAppContext();
  const { data: reports = [], isLoading } = useReports();
  const { data: summary } = useReportSummary();
  const uploadMutation = useUploadAnalysis({ onComplete: setActiveReport });
  const report = activeReport || reports[0] || null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <UploadDropzone onUpload={uploadMutation.mutate} isUploading={uploadMutation.isPending} />
        {report ? (
          <HealthScore score={report.performanceScore} grade={report.grade} />
        ) : (
          <section className="panel flex min-h-64 flex-col justify-between p-6">
            <div>
              <p className="text-sm font-medium uppercase text-zinc-500">Workspace</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Diagnostic history</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-lg bg-cloud p-4">
                <FileSpreadsheet className="h-5 w-5 text-signal" aria-hidden="true" />
                <p className="mt-3 text-2xl font-semibold text-ink">{summary?.count || 0}</p>
                <p className="text-sm text-zinc-500">Reports</p>
              </div>
              <div className="rounded-lg bg-cloud p-4">
                <CalendarDays className="h-5 w-5 text-amber" aria-hidden="true" />
                <p className="mt-3 text-2xl font-semibold text-ink">{formatCurrency(summary?.totalSpend || 0)}</p>
                <p className="text-sm text-zinc-500">Tracked spend</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {report ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase text-zinc-500">Active report</p>
              <h2 className="mt-1 text-2xl font-semibold text-ink">{report.sourceFile}</h2>
            </div>
            <p className="text-sm text-zinc-500">{formatDate(report.createdAt)}</p>
          </div>
          <ReportOverview report={report} />
        </motion.div>
      ) : isLoading ? (
        <section className="panel min-h-96 animate-pulse p-8" />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

