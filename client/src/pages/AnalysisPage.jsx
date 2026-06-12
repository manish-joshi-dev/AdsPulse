import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Download, Share2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';
import { useAnalysisPoller } from '../hooks/useAnalysisPoller.js';
import { ProgressTracker } from '../components/dashboard/ProgressTracker.jsx';
import { ScoreGauge } from '../components/analysis/ScoreGauge.jsx';
import { OverviewTab } from '../components/analysis/OverviewTab.jsx';
import { DiagnosticsTab } from '../components/analysis/DiagnosticsTab.jsx';
import { AnomaliesTab } from '../components/analysis/AnomaliesTab.jsx';
import { RecommendationsTab } from '../components/analysis/RecommendationsTab.jsx';
import { RawDataTab } from '../components/analysis/RawDataTab.jsx';

/**
 * AnalysisPage - Core feature: Full analysis dashboard with multiple tabs
 */
export const AnalysisPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Polling for job status
  const { status: pollStatus, progress: pollProgress, error: pollError } = useAnalysisPoller(jobId);

  // Fetch analysis results
  const { data: analysis, isLoading, error, refetch } = useQuery({
    queryKey: ['analysis', jobId],
    queryFn: () => api.analysis.getResults(jobId),
    enabled: !!jobId,
    staleTime: Infinity
  });

  // Handle polling completion
  useEffect(() => {
    if (pollStatus === 'completed') {
      refetch();
    } else if (pollStatus === 'failed') {
      toast.error(pollError || 'Analysis failed');
    }
  }, [pollStatus, pollError, refetch]);

  // Handle error
  if (error && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div
          className="p-8 rounded-xl border text-center max-w-md"
          style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)'
          }}
        >
          <AlertCircle
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: 'var(--color-accent-critical)' }}
          />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Analysis Not Found
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }} className="mb-6">
            {error.message || 'Unable to load analysis results'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2 px-4 rounded-lg font-semibold transition-all"
            style={{
              background: 'var(--color-accent-primary)',
              color: 'white'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show loading/processing state
  if (isLoading || (pollStatus && ['queued', 'processing'].includes(pollStatus))) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <ProgressTracker
          progress={pollProgress || 0}
          status="processing"
          currentStep="Loading analysis..."
        />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'diagnostics', label: 'Diagnostics', count: analysis.diagnostics?.length },
    { id: 'anomalies', label: 'Anomalies', count: analysis.anomalies?.length },
    { id: 'recommendations', label: 'AI Recommendations', count: analysis.aiRecommendations?.length },
    { id: 'raw-data', label: 'Raw Data' }
  ];

  const handleShare = async () => {
    try {
      const report = await api.reports.generate(jobId, `${analysis.fileName} diagnostic report`);
      const share = await api.reports.share(report._id);
      navigator.clipboard.writeText(share.shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error(error.message || 'Failed to generate share link');
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await api.reports.generate(jobId);
      toast.success('Report generated!');
      navigate(`/report/${response._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to generate report');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 px-6 md:px-8 py-6"
        style={{
          background: 'var(--color-bg-primary)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* File info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                Analysis
              </p>
              <h1 className="text-3xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
                {analysis.fileName}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mt-2">
                {new Date(analysis.createdAt).toLocaleDateString()} at{' '}
                {new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                style={{
                  background: 'var(--color-accent-primary)',
                  color: 'white'
                }}
              >
                <Download className="w-4 h-4" />
                Generate Report
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 border"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 border"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <Plus className="w-4 h-4" />
                New Analysis
              </button>
            </div>
          </div>

          {/* Score gauge and quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
            <ScoreGauge score={analysis.performanceScore} scoreBand={analysis.scoreBand} />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className="p-4 rounded-lg border"
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium">
                  Campaigns
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
                  {analysis.campaignCount}
                </p>
              </div>
              <div
                className="p-4 rounded-lg border"
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium">
                  Issues
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
                  {analysis.diagnostics?.length || 0}
                </p>
              </div>
              <div
                className="p-4 rounded-lg border"
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium">
                  Anomalies
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
                  {analysis.anomalies?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div
        className="sticky top-[200px] md:top-[220px] z-9 px-6 md:px-8"
        style={{
          background: 'var(--color-bg-primary)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors relative"
              style={{
                borderBottomColor: activeTab === tab.id ? 'var(--color-accent-primary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className="ml-2 px-2 py-0.5 rounded text-xs font-bold"
                  style={{
                    background: 'rgba(79, 142, 247, 0.1)',
                    color: 'var(--color-accent-primary)'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="px-6 md:px-8 py-8 max-w-7xl mx-auto w-full"
        >
          {activeTab === 'overview' && <OverviewTab analysis={analysis} />}
          {activeTab === 'diagnostics' && <DiagnosticsTab diagnostics={analysis.diagnostics || []} />}
          {activeTab === 'anomalies' && <AnomaliesTab anomalies={analysis.anomalies || []} />}
          {activeTab === 'recommendations' && (
            <RecommendationsTab recommendations={analysis.aiRecommendations || []} />
          )}
          {activeTab === 'raw-data' && <RawDataTab data={analysis.csvData || []} />}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisPage;
