import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

/**
 * OverviewTab - Score breakdown, campaign performance, top issues, and charts
 */
export const OverviewTab = ({ analysis }) => {
  const scoreBreakdown = analysis.scoreBreakdown || {
    ctrScore: 18,
    roasScore: 20,
    conversionScore: 15,
    impressionShareScore: 22
  };

  // Sample campaign data for demonstration
  const campaigns = [
    { name: 'Brand - Exact', clicks: 1250, impressions: 28900, ctr: 4.3, avgCpc: 1.2, conversions: 125, roas: 6.5 },
    { name: 'Generic Keywords', clicks: 420, impressions: 65000, ctr: 0.6, avgCpc: 2.3, conversions: 8, roas: 1.2 },
    { name: 'Competitor', clicks: 180, impressions: 8500, ctr: 2.1, avgCpc: 8.5, conversions: 2, roas: 0.8 }
  ];

  const topIssues = (analysis.diagnostics || []).slice(0, 3);

  const chartData = campaigns.map(c => ({
    campaign: c.name.substring(0, 15),
    ctr: (c.ctr * 100).toFixed(2),
    benchmark: 1.91 * 100
  }));

  const roasData = campaigns.map(c => ({
    campaign: c.name.substring(0, 15),
    roas: c.roas,
    benchmark: 2.0
  }));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Score Breakdown */}
      <motion.section variants={item}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Score Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CTR Score', value: scoreBreakdown.ctrScore },
            { label: 'ROAS Score', value: scoreBreakdown.roasScore },
            { label: 'Conversion Score', value: scoreBreakdown.conversionScore },
            { label: 'Impression Share', value: scoreBreakdown.impressionShareScore }
          ].map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)'
              }}
            >
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs font-medium uppercase">
                {metric.label}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                  {metric.value}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mb-1">
                  / 25
                </p>
              </div>
              <div
                className="mt-3 h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--color-bg-primary)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(metric.value / 25) * 100}%`,
                    background: 'linear-gradient(90deg, #4F8EF7, #60A5FA)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Campaign Performance Table */}
      <motion.section variants={item}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Campaign Performance
        </h2>
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
                background: 'var(--color-bg-primary)',
                borderBottomColor: 'var(--color-border)'
              }}
              className="border-b"
            >
              <tr>
                {['Campaign', 'Clicks', 'Impressions', 'CTR', 'Avg CPC', 'Conversions', 'ROAS'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, idx) => {
                const roasHealth = campaign.roas >= 2 ? 'good' : campaign.roas >= 1 ? 'average' : 'poor';
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottomColor: 'var(--color-border)',
                      borderLeftColor: roasHealth === 'good' ? '#34D399' : roasHealth === 'average' ? '#FBBF24' : '#F87171',
                      borderLeftWidth: '4px'
                    }}
                    className={`border-b transition-colors hover:bg-[var(--color-bg-primary)]`}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {campaign.name}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                      {campaign.clicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                      {campaign.impressions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                      {campaign.ctr.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                      ${campaign.avgCpc.toFixed(2)}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                      {campaign.conversions}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {campaign.roas.toFixed(2)}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Top Issues */}
      {topIssues.length > 0 && (
        <motion.section variants={item}>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Top Issues
          </h2>
          <div className="space-y-3">
            {topIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border flex items-start gap-4"
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                  borderLeftColor: issue.severity === 'critical' ? '#F87171' : '#FBBF24',
                  borderLeftWidth: '4px'
                }}
              >
                <AlertTriangle
                  className="w-5 h-5 flex-shrink-0 mt-1"
                  style={{
                    color: issue.severity === 'critical' ? '#F87171' : '#FBBF24'
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {issue.flagType}
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mt-1">
                    {issue.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Charts */}
      <motion.section variants={item}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Performance Comparison
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CTR Chart */}
          <div
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)'
            }}
          >
            <p style={{ color: 'var(--color-text-primary)' }} className="font-semibold mb-4">
              CTR by Campaign vs Benchmark
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="campaign" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Legend />
                <Bar dataKey="ctr" fill="#4F8EF7" name="Actual CTR (%)" />
                <Bar dataKey="benchmark" fill="#FBBF24" name="Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROAS Chart */}
          <div
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)'
            }}
          >
            <p style={{ color: 'var(--color-text-primary)' }} className="font-semibold mb-4">
              ROAS by Campaign
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="campaign" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Legend />
                <Bar dataKey="roas" fill="#34D399" name="Actual ROAS" />
                <ReferenceLine y={2} stroke="#FBBF24" name="Healthy Threshold" strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default OverviewTab;
