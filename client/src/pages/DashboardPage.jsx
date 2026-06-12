import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, AlertCircle, Target, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { useAnalysisPoller } from '../hooks/useAnalysisPoller.js';
import { UploadZone } from '../components/dashboard/UploadZone.jsx';
import { StatsCard } from '../components/dashboard/StatsCard.jsx';
import { RecentAnalysesTable } from '../components/dashboard/RecentAnalysesTable.jsx';

/**
 * DashboardPage - Main logged-in dashboard
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentAnalysisJobId, setCurrentAnalysisJobId] = useState(null);
  const [currentStep, setCurrentStep] = useState('Parsing CSV...');

  // Fetch analysis history
  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['analysisHistory'],
    queryFn: api.analysis.getHistory,
    staleTime: 30000
  });

  // Polling for current analysis
  const { status: pollStatus, progress: pollProgress, error: pollError, isPolling } = useAnalysisPoller(
    currentAnalysisJobId
  );

  // Update upload progress based on poll progress
  useEffect(() => {
    if (pollProgress !== undefined) {
      setUploadProgress(pollProgress);

      // Update step label based on progress
      if (pollProgress < 25) {
        setCurrentStep('Parsing CSV...');
      } else if (pollProgress < 50) {
        setCurrentStep('Running diagnostics...');
      } else if (pollProgress < 70) {
        setCurrentStep('Computing performance score...');
      } else if (pollProgress < 85) {
        setCurrentStep('Detecting anomalies...');
      } else if (pollProgress < 95) {
        setCurrentStep('Generating AI recommendations...');
      } else {
        setCurrentStep('Completing analysis...');
      }
    }
  }, [pollProgress]);

  // Handle analysis completion
  useEffect(() => {
    if (pollStatus === 'completed') {
      setIsUploading(false);
      toast.success('Analysis complete');
      navigate(`/analysis/${currentAnalysisJobId}`);
      setCurrentAnalysisJobId(null);
      refetchHistory();
    } else if (pollStatus === 'failed') {
      setIsUploading(false);
      toast.error(pollError || 'Analysis failed');
      setCurrentAnalysisJobId(null);
    }
  }, [pollStatus, pollError, currentAnalysisJobId, navigate, refetchHistory]);

  // Handle file upload
  const handleUploadStart = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await api.upload.uploadCSV(file, (progress) => {
        setUploadProgress(Math.round(progress * 0.25));
      });

      setCurrentAnalysisJobId(response.jobId);
      setUploadProgress(25);
      setCurrentStep('Parsing CSV...');
    } catch (error) {
      setIsUploading(false);
      setCurrentAnalysisJobId(null);
      toast.error(error.message || 'Upload failed');
    }
  };

  // Calculate stats
  const stats = {
    totalAnalyses: historyData?.length || 0,
    avgScore:
      historyData && historyData.length > 0
        ? Math.round(
            historyData.reduce((sum, item) => sum + (item.performanceScore || 0), 0) /
              historyData.length
          )
        : 0,
    totalFlags: historyData
      ? historyData.reduce((sum, item) => sum + (item.diagnostics?.length || 0), 0)
      : 0,
    lastDate: historyData && historyData.length > 0 ? historyData[0].createdAt : null
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Welcome Header */}
      <div
        className="sticky top-0 z-10 px-6 md:px-8 py-6"
        style={{
          background: 'var(--color-bg-primary)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mt-1">
          Ready to diagnose your campaigns? · {formatDate(new Date())}
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={BarChart3}
            label="Total Analyses"
            value={stats.totalAnalyses}
            trend={null}
          />
          <StatsCard
            icon={Target}
            label="Average Score"
            value={`${stats.avgScore}/100`}
            trend={null}
          />
          <StatsCard
            icon={AlertCircle}
            label="Issues Found"
            value={stats.totalFlags}
            trend={null}
          />
          <StatsCard
            icon={Clock}
            label="Last Analysis"
            value={stats.lastDate ? formatDate(stats.lastDate).split(' ')[0] : 'None'}
            trendLabel={stats.lastDate ? 'Recently' : 'Not yet'}
          />
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Upload Your Google Ads CSV
          </h2>
          <UploadZone
            onUploadStart={handleUploadStart}
            onProgress={setUploadProgress}
            isUploading={isUploading}
            progress={uploadProgress}
            currentStep={currentStep}
          />
        </div>

        {/* Recent Analyses */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Recent Analyses
          </h2>
          <RecentAnalysesTable
            data={historyData || []}
            isLoading={historyLoading}
            onDelete={async (jobId) => {
              try {
                await api.analysis.deleteAnalysis(jobId);
                refetchHistory();
              } catch (error) {
                toast.error('Failed to delete analysis');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
