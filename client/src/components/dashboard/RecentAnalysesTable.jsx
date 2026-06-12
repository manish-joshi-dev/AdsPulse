import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const formatRelativeDate = (dateValue) => {
  const timestamp = new Date(dateValue).getTime();
  if (!Number.isFinite(timestamp)) {
    return 'Unknown date';
  }

  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(timestamp));
};

/**
 * SkeletonRow - Loading skeleton for table row
 */
const SkeletonRow = () => (
  <tr style={{ borderBottomColor: 'var(--color-border)' }} className="border-b">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div
          className="h-4 rounded animate-pulse"
          style={{ background: 'var(--color-bg-primary)' }}
        />
      </td>
    ))}
  </tr>
);

/**
 * ScoreBadge - Colored badge for performance score
 */
const ScoreBadge = ({ band = 'Average' }) => {
  const colors = {
    'Critical': { bg: 'rgba(248, 113, 113, 0.1)', text: '#F87171' },
    'Poor': { bg: 'rgba(251, 146, 60, 0.1)', text: '#FB923C' },
    'Average': { bg: 'rgba(251, 191, 36, 0.1)', text: '#FBBF24' },
    'Good': { bg: 'rgba(52, 211, 153, 0.1)', text: '#34D399' },
    'Excellent': { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' }
  };

  const color = colors[band] || colors['Average'];

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.text}20`
      }}
    >
      {band}
    </span>
  );
};

/**
 * RecentAnalysesTable - Shows last 5 analyses
 */
export const RecentAnalysesTable = ({ data, isLoading, onDelete }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <table className="w-full">
          <thead
            style={{ borderBottomColor: 'var(--color-border)', background: 'var(--color-bg-primary)' }}
            className="border-b"
          >
            <tr>
              {['File Name', 'Date', 'Campaigns', 'Score', 'Status', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-xl border p-12 text-center"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
        <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          No analyses yet
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mt-2">
          Upload your first Google Ads CSV above to get started
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)'
      }}
    >
      <table className="w-full">
        <thead
          style={{
            borderBottomColor: 'var(--color-border)',
            background: 'var(--color-bg-primary)'
          }}
          className="border-b"
        >
          <tr>
            <th
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              File Name
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Date
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Campaigns
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Score
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Status
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((item, idx) => (
            <tr
              key={item._id || idx}
              style={{
                borderBottomColor: idx < data.length - 1 ? 'var(--color-border)' : 'transparent'
              }}
              className={`border-b transition-colors hover:bg-[var(--color-bg-primary)]`}
            >
              {/* File Name */}
              <td className="px-6 py-4">
                <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {item.fileName}
                </p>
              </td>

              {/* Date */}
              <td className="px-6 py-4">
                <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                  {formatRelativeDate(item.createdAt)}
                </p>
              </td>

              {/* Campaigns */}
              <td className="px-6 py-4">
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {item.campaignCount || 0}
                </p>
              </td>

              {/* Score */}
              <td className="px-6 py-4">
                {item.status === 'completed' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                      {item.performanceScore}
                    </span>
                    <ScoreBadge band={item.scoreBand} />
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                    —
                  </p>
                )}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background:
                      item.status === 'completed'
                        ? 'rgba(52, 211, 153, 0.1)'
                        : item.status === 'processing'
                        ? 'rgba(251, 191, 36, 0.1)'
                        : 'rgba(248, 113, 113, 0.1)',
                    color:
                      item.status === 'completed'
                        ? '#34D399'
                        : item.status === 'processing'
                        ? '#FBBF24'
                        : '#F87171'
                  }}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {item.status === 'completed' && (
                    <button
                      onClick={() => navigate(`/analysis/${item.jobId}`)}
                      className="p-2 rounded-lg transition-all hover:bg-[rgba(79,142,247,0.1)]"
                      title="View Results"
                    >
                      <Eye className="w-4 h-4 text-[#4F8EF7]" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this analysis?')) {
                        onDelete(item.jobId);
                        toast.success('Analysis deleted');
                      }
                    }}
                    className="p-2 rounded-lg transition-all hover:bg-[rgba(248,113,113,0.1)]"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-[#F87171]" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View All link */}
      {data.length > 5 && (
        <div
          className="px-6 py-4 text-center border-t transition-colors hover:bg-[var(--color-bg-primary)]"
          style={{ borderTopColor: 'var(--color-border)' }}
        >
          <button
            onClick={() => navigate('/history')}
            className="font-semibold text-sm transition-colors"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            View all analyses →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAnalysesTable;
