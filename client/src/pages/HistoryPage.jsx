import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../services/api.js";
import { formatDate } from "../utils/formatters.js";

export const HistoryPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ["analysisHistory"],
    queryFn: api.analysis.getHistory
  });

  const deleteMutation = useMutation({
    mutationFn: api.analysis.deleteAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysisHistory"] });
      toast.success("Analysis deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete analysis");
    }
  });

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((analysis) => {
      const fileName = analysis.fileName || "";
      const matchesSearch = fileName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScore = scoreFilter === "All" || analysis.scoreBand === scoreFilter;
      const matchesStatus = statusFilter === "All" || analysis.status === statusFilter;
      return matchesSearch && matchesScore && matchesStatus;
    });
  }, [analyses, searchTerm, scoreFilter, statusFilter]);

  const toggleSelect = (jobId) => {
    setSelectedIds((prev) => (
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    ));
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;

    if (window.confirm(`Delete ${selectedIds.length} analyses?`)) {
      selectedIds.forEach((jobId) => deleteMutation.mutate(jobId));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Analysis History</h1>
          <p className="text-zinc-500">All your past Google Ads diagnostics in one place</p>
        </div>
        {selectedIds.length > 0 && (
          <button onClick={handleBulkDelete} className="flex items-center gap-2 rounded-lg bg-rose px-4 py-2 text-white">
            <Trash2 className="h-4 w-4" /> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            placeholder="Search files..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-zinc-300 px-3 py-2"
          value={scoreFilter}
          onChange={(event) => setScoreFilter(event.target.value)}
        >
          <option value="All">All Bands</option>
          {["Excellent", "Good", "Average", "Poor", "Critical"].map((band) => (
            <option key={band} value={band}>{band}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-zinc-300 px-3 py-2"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          {["queued", "processing", "completed", "failed"].map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-48 rounded-lg bg-cloud animate-pulse" />)}
        </div>
      ) : filteredAnalyses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAnalyses.map((analysis) => (
            <div key={analysis.jobId} className="panel flex flex-col p-5">
              <input
                type="checkbox"
                checked={selectedIds.includes(analysis.jobId)}
                onChange={() => toggleSelect(analysis.jobId)}
                className="self-end"
              />
              <h3 className="font-semibold">{analysis.fileName}</h3>
              <p className="text-sm text-zinc-500">{formatDate(analysis.createdAt)}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-16 w-16 rounded-full border-4 border-signal flex items-center justify-center font-bold text-xl">
                  {analysis.performanceScore ?? "-"}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase">{analysis.scoreBand || analysis.status}</p>
                  <p className="text-sm">{analysis.campaignCount || 0} Campaigns</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {analysis.status === "completed" ? (
                  <Link to={`/analysis/${analysis.jobId}`} className="flex-1 rounded border p-2 text-center text-sm">View</Link>
                ) : (
                  <span className="flex-1 rounded border p-2 text-center text-sm text-zinc-500">{analysis.status}</span>
                )}
                <button onClick={() => deleteMutation.mutate(analysis.jobId)} className="text-rose" aria-label={`Delete ${analysis.fileName}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <p>No analyses found.</p>
          <Link to="/dashboard" className="text-signal underline">Upload your first CSV from the dashboard.</Link>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
