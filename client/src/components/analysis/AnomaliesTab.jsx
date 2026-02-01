import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Filter, BarChart3 } from 'lucide-react';

/**
 * AnomalyCard - Individual anomaly row
 */
const AnomalyCard = ({ anomaly }) => {
  const isIncrease = anomaly.direction === 'increase';
  const changeColor = isIncrease ? '#34D399' : '#F87171';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-lg border flex items-center justify-between"
      style={{
        background: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
        borderLeftColor: changeColor,
        borderLeftWidth: '4px'
      }}
    >
      <div className="flex-1">
        <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {anomaly.affectedEntity}
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
          {anomaly.metricName}
        </p>
        <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-1">
          {anomaly.period}
        </p>
      </div>

      <div className="flex items-center gap-6 text-right">
        <div>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium mb-1">
            Previous → Current
          </p>
          <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
            {anomaly.previousValue?.toFixed(2)} → {anomaly.currentValue?.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isIncrease ? (
            <TrendingUp className="w-5 h-5" style={{ color: changeColor }} />
          ) : (
            <TrendingDown className="w-5 h-5" style={{ color: changeColor }} />
          )}
          <div>
            <p
              className="font-bold text-lg"
              style={{ color: changeColor }}
            >
              {Math.abs(anomaly.changePercent).toFixed(1)}%
            </p>
            <p
              className="text-xs font-medium"
              style={{
                color: changeColor,
                opacity: 0.8
              }}
            >
              Z: {anomaly.zScore?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * AnomaliesTab - Week-over-week anomaly detection results
 */
export const AnomaliesTab = ({ anomalies = [] }) => {
  const [filter, setFilter] = useState('all');

  // Filter anomalies
  const filtered = anomalies.filter(a => {
    if (filter === 'increases') return a.direction === 'increase';
    if (filter === 'decreases') return a.direction === 'decrease';
    return true;
  });

  const increases = anomalies.filter(a => a.direction === 'increase').length;
  const decreases = anomalies.filter(a => a.direction === 'decrease').length;

  if (!anomalies || anomalies.length === 0) {
    return (
      <div
        className="p-12 rounded-lg border text-center"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(52, 211, 153, 0.1)' }}
          >
            <BarChart3 className="w-8 h-8" style={{ color: '#34D399' }} />
          </div>
        </div>
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          No anomalies detected
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Your metrics are stable between periods. No significant changes found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="p-4 rounded-lg border text-center"
          style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
            cursor: 'pointer',
            opacity: filter === 'all' ? 1 : 0.6,
            borderTopWidth: filter === 'all' ? '3px' : '1px',
            borderTopColor: filter === 'all' ? 'var(--color-accent-primary)' : 'var(--color-border)'
          }}
          onClick={() => setFilter('all')}
        >
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium mb-1">
            TOTAL ANOMALIES
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {anomalies.length}
          </p>
        </div>

        <div
          className="p-4 rounded-lg border text-center"
          style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
            cursor: 'pointer',
            opacity: filter === 'increases' ? 1 : 0.6,
            borderTopWidth: filter === 'increases' ? '3px' : '1px',
            borderTopColor: filter === 'increases' ? '#34D399' : 'var(--color-border)'
          }}
          onClick={() => setFilter('increases')}
        >
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium mb-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" style={{ color: '#34D399' }} /> INCREASES
          </p>
          <p className="text-3xl font-bold" style={{ color: '#34D399' }}>
            {increases}
          </p>
        </div>

        <div
          className="p-4 rounded-lg border text-center"
          style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
            cursor: 'pointer',
            opacity: filter === 'decreases' ? 1 : 0.6,
            borderTopWidth: filter === 'decreases' ? '3px' : '1px',
            borderTopColor: filter === 'decreases' ? '#F87171' : 'var(--color-border)'
          }}
          onClick={() => setFilter('decreases')}
        >
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium mb-1 flex items-center justify-center gap-1">
            <TrendingDown className="w-3 h-3" style={{ color: '#F87171' }} /> DECREASES
          </p>
          <p className="text-3xl font-bold" style={{ color: '#F87171' }}>
            {decreases}
          </p>
        </div>
      </div>

      {/* Anomaly List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium">
            Showing {filtered.length} anomal{filtered.length === 1 ? 'y' : 'ies'}
          </p>
        </div>

        {filtered.map((anomaly, idx) => (
          <AnomalyCard key={idx} anomaly={anomaly} />
        ))}
      </div>
    </div>
  );
};

export default AnomaliesTab;
