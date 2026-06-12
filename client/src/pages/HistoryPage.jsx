import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Calendar, Filter, ChevronDown } from "lucide-react";
import { useDeleteReport, useReports } from "../hooks/useReports.js";
import { formatDate, formatNumber } from "../utils/formatters.js";

export const HistoryPage = () => {
  const { data: reports = [], isLoading } = useReports();
  const deleteMutation = useDeleteReport();
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = r.sourceFile.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScore = scoreFilter === "All" || r.grade === scoreFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesScore && matchesStatus;
    });
  }, [reports, searchTerm, scoreFilter, statusFilter]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} reports?`)) {
      selectedIds.forEach((id) => deleteMutation.mutate(id));
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

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input 
            placeholder="Search files..." 
            className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="rounded-lg border border-zinc-300 px-3" onChange={(e) => setScoreFilter(e.target.value)}>
          <option>All Bands</option>
          {['Excellent', 'Good', 'Average', 'Poor', 'Critical'].map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-lg bg-cloud animate-pulse" />)}
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <div key={report.id} className="panel flex flex-col p-5">
              <input type="checkbox" checked={selectedIds.includes(report.id)} onChange={() => toggleSelect(report.id)} className="self-end" />
              <h3 className="font-semibold">{report.sourceFile}</h3>
              <p className="text-sm text-zinc-500">{formatDate(report.createdAt)}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-16 w-16 rounded-full border-4 border-signal flex items-center justify-center font-bold text-xl">{report.performanceScore}</div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase">{report.grade}</p>
                  <p className="text-sm">{report.campaignCount} Campaigns</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/report/${report.id}`} className="flex-1 rounded border p-2 text-center text-sm">View</Link>
                <button onClick={() => deleteMutation.mutate(report.id)} className="text-rose"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <p>No analyses found.</p>
          <Link to="/dashboard" className="text-signal underline">Upload your first CSV from the Dashboard.</Link>
        </div>
      )}
    </div>
  );
};
