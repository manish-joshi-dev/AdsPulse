import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatsCard - Displays a single metric with label and trend
 */
export const StatsCard = ({ icon: Icon, label, value, trend = null, trendLabel = null }) => {
  const isTrendUp = trend && trend > 0;

  return (
    <div
      className="p-6 rounded-xl border transition-all hover:border-[#4F8EF7]/50"
      style={{
        background: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--color-bg-primary)' }}
        >
          <Icon className="w-6 h-6 text-[#4F8EF7]" />
        </div>

        {trend !== null && (
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: isTrendUp
                ? 'rgba(52, 211, 153, 0.1)'
                : 'rgba(248, 113, 113, 0.1)',
              color: isTrendUp ? '#34D399' : '#F87171'
            }}
          >
            {isTrendUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium mb-1">
        {label}
      </p>

      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {value}
        </p>
        {trendLabel && (
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs">
            {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
