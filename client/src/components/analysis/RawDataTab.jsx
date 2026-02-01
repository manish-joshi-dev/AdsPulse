import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * RawDataTab - Paginated CSV data table with search and sort
 */
export const RawDataTab = ({ data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const rowsPerPage = 10;

  // Filter data
  const filtered = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sorted = useMemo(() => {
    const sorted = [...filtered];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }
    return sorted;
  }, [filtered, sortConfig]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = sorted.slice(startIdx, startIdx + rowsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <div
        className="p-12 rounded-lg border text-center"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          No data available
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Raw data will appear once the analysis is complete.
        </p>
      </div>
    );
  }

  const columns = Object.keys(data[0] || {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex-1 min-w-64 px-4 py-2 rounded-lg border flex items-center gap-2"
          style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)'
          }}
        >
          <Search className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent flex-1 outline-none text-sm"
            style={{ color: 'var(--color-text-primary)' }}
          />
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all hover:opacity-80"
          style={{
            background: 'var(--color-accent-primary)',
            color: 'white'
          }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Info */}
      <div style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium">
        Showing {paginatedData.length} of {sorted.length} rows · {totalPages} pages
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-x-auto"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <table className="w-full">
          <thead
            style={{
              background: 'var(--color-bg-primary)',
              borderBottomColor: 'var(--color-border)'
            }}
            className="border-b"
          >
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[rgba(79,142,247,0.05)] transition-all select-none"
                  style={{
                    color: 'var(--color-text-secondary)',
                    minWidth: '120px'
                  }}
                >
                  <div className="flex items-center gap-2">
                    {col}
                    {sortConfig.key === col && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottomColor: 'var(--color-border)',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)'
                }}
                className={`border-b transition-colors hover:bg-[var(--color-bg-primary)]`}
              >
                {columns.map(col => (
                  <td
                    key={`${idx}-${col}`}
                    className="px-4 py-3 text-sm"
                    style={{
                      color: 'var(--color-text-primary)',
                      minWidth: '120px',
                      wordBreak: 'break-word',
                      maxWidth: '200px'
                    }}
                  >
                    {String(row[col] || '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: currentPage === 1 ? 'var(--color-bg-secondary)' : 'var(--color-accent-primary)',
              color: currentPage === 1 ? 'var(--color-text-secondary)' : 'white',
              border: currentPage === 1 ? '1px solid var(--color-border)' : 'none'
            }}
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 rounded text-xs font-bold transition-all"
                  style={{
                    background: currentPage === pageNum ? 'var(--color-accent-primary)' : 'var(--color-bg-secondary)',
                    color: currentPage === pageNum ? 'white' : 'var(--color-text-primary)',
                    border: currentPage === pageNum ? 'none' : '1px solid var(--color-border)'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: currentPage === totalPages ? 'var(--color-bg-secondary)' : 'var(--color-accent-primary)',
              color: currentPage === totalPages ? 'var(--color-text-secondary)' : 'white',
              border: currentPage === totalPages ? '1px solid var(--color-border)' : 'none'
            }}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RawDataTab;
