import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

const HOW_TO_FIX = {
  'LOW_CTR': '1. Review ad copy relevance to keywords. 2. A/B test new headlines. 3. Check search term report for irrelevant traffic. 4. Consider more specific match types.',
  'HIGH_CPC_LOW_CVR': '1. Review landing page experience. 2. Check conversion tracking setup. 3. Tighten keyword targeting. 4. Improve Quality Score to lower CPC.',
  'BUDGET_IMPRESSION_LOSS': '1. Increase daily budget or adjust campaign scheduling. 2. Review if high-performing campaigns are budget-capped. 3. Consider ECPC or Target ROAS bidding.',
  'RANK_IMPRESSION_LOSS': '1. Improve Quality Score components. 2. Review Ad Rank factors. 3. Increase bids on high-value keywords. 4. Improve landing page relevance.',
  'ZERO_IMPRESSIONS': '1. Check if ads and ad groups are active (not paused). 2. Verify keywords aren\'t disapproved. 3. Check bid amounts vs auction insights. 4. Review audience targeting.',
  'QUALITY_SCORE_ANOMALY': '1. Improve ad-to-keyword relevance. 2. Optimize landing page speed and relevance. 3. Review historical CTR data. 4. Use Dynamic Keyword Insertion carefully.',
  'LOW_ROAS': '1. Pause keywords with spend but zero conversions. 2. Review and update conversion tracking. 3. Apply Target ROAS bidding strategy. 4. Exclude non-converting audiences.',
  'HIGH_BOUNCE_SPEND': '1. Improve landing page relevance and speed. 2. Refine audience targeting. 3. Review ad copy alignment. 4. Consider audience exclusions.'
};

/**
 * DiagnosticCard - Individual diagnostic flag card with expandable fix section
 */
const DiagnosticCard = ({ diagnostic }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityColors = {
    'critical': { bg: 'rgba(248, 113, 113, 0.1)', badge: '#F87171', border: '#F87171' },
    'warning': { bg: 'rgba(251, 191, 36, 0.1)', badge: '#FBBF24', border: '#FBBF24' },
    'info': { bg: 'rgba(96, 165, 250, 0.1)', badge: '#60A5FA', border: '#60A5FA' }
  };

  const colors = severityColors[diagnostic.severity] || severityColors.info;
  const delta = diagnostic.delta || 0;
  const isNegative = delta < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg border transition-all"
      style={{
        background: colors.bg,
        borderColor: colors.border,
        borderLeftWidth: '4px'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
            style={{ background: colors.badge }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                {diagnostic.flagType}
              </p>
              <span
                className="px-2 py-1 rounded text-xs font-bold"
                style={{
                  background: colors.bg,
                  color: colors.badge,
                  border: `1px solid ${colors.badge}`
                }}
              >
                {diagnostic.severity.toUpperCase()}
              </span>
            </div>
            <p className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              {diagnostic.affectedEntity}
            </p>
          </div>
        </div>

        {/* Delta indicator */}
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end mb-1">
            {isNegative ? (
              <TrendingDown className="w-4 h-4" style={{ color: '#F87171' }} />
            ) : (
              <TrendingUp className="w-4 h-4" style={{ color: '#34D399' }} />
            )}
            <span
              className="font-bold text-lg"
              style={{ color: isNegative ? '#F87171' : '#34D399' }}
            >
              {Math.abs(delta)}%
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs">
            vs benchmark
          </p>
        </div>
      </div>

      {/* Metric details */}
      <div className="mb-4 p-3 rounded" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium mb-2">
          {diagnostic.metricName}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Actual
            </p>
            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {diagnostic.actualValue?.toFixed(2)}
            </p>
          </div>
          <div className="h-8 w-px" style={{ background: 'var(--color-border)' }} />
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Benchmark
            </p>
            <p className="font-semibold" style={{ color: 'var(--color-accent-primary)' }}>
              {diagnostic.benchmarkValue?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mb-4">
        {diagnostic.description}
      </p>

      {/* How to fix */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded transition-all"
        style={{
          background: 'rgba(0,0,0,0.1)',
          border: `1px solid ${colors.border}`
        }}
      >
        <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
          How to fix
        </span>
        <ChevronDown
          className="w-4 h-4 transition-transform"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--color-text-secondary)'
          }}
        />
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-3 rounded"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        >
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm leading-relaxed">
            {HOW_TO_FIX[diagnostic.flagType] || 'No specific guidance available for this issue.'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * DiagnosticsTab - Full diagnostic flags list grouped by severity
 */
export const DiagnosticsTab = ({ diagnostics = [] }) => {
  if (!diagnostics || diagnostics.length === 0) {
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
            <AlertCircle className="w-8 h-8" style={{ color: '#34D399' }} />
          </div>
        </div>
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          ✓ No issues detected
        </p>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Your account health looks great! Keep monitoring for changes.
        </p>
      </div>
    );
  }

  // Group by severity
  const grouped = {
    critical: diagnostics.filter(d => d.severity === 'critical'),
    warning: diagnostics.filter(d => d.severity === 'warning'),
    info: diagnostics.filter(d => d.severity === 'info')
  };

  return (
    <div className="space-y-8">
      {grouped.critical.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: '#F87171' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Critical Issues ({grouped.critical.length})
            </h3>
          </div>
          <div className="space-y-4">
            {grouped.critical.map((diagnostic, idx) => (
              <DiagnosticCard key={idx} diagnostic={diagnostic} />
            ))}
          </div>
        </motion.section>
      )}

      {grouped.warning.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: grouped.critical.length > 0 ? 0.1 : 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: '#FBBF24' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Warnings ({grouped.warning.length})
            </h3>
          </div>
          <div className="space-y-4">
            {grouped.warning.map((diagnostic, idx) => (
              <DiagnosticCard key={idx} diagnostic={diagnostic} />
            ))}
          </div>
        </motion.section>
      )}

      {grouped.info.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (grouped.critical.length > 0 || grouped.warning.length > 0) ? 0.2 : 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: '#60A5FA' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Info ({grouped.info.length})
            </h3>
          </div>
          <div className="space-y-4">
            {grouped.info.map((diagnostic, idx) => (
              <DiagnosticCard key={idx} diagnostic={diagnostic} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default DiagnosticsTab;
