import { api } from "./api.js";

const toLegacyReportShape = (analysis) => ({
  ...analysis,
  id: analysis.jobId,
  sourceFile: analysis.fileName,
  grade: analysis.scoreBand,
  createdAt: analysis.createdAt,
  performanceScore: analysis.performanceScore,
  campaignCount: analysis.campaignCount,
  status: analysis.status
});

export const uploadCsv = async (file) => {
  return api.upload.uploadCSV(file);
};

export const fetchReports = async () => {
  const analyses = await api.analysis.getHistory();
  return analyses.map(toLegacyReportShape);
};

export const fetchReport = async (id) => {
  const isMongoObjectId = /^[a-f\d]{24}$/i.test(id);

  if (isMongoObjectId) {
    const report = await api.reports.get(id);
    const analysis = report.analysisJobId || {};
    return {
      ...report,
      sourceFile: analysis.fileName || report.title,
      grade: analysis.scoreBand,
      performanceScore: analysis.performanceScore,
      diagnostics: analysis.diagnostics || [],
      anomalies: analysis.anomalies || [],
      aiRecommendations: analysis.aiRecommendations || []
    };
  }

  return api.analysis.getResults(id).then(toLegacyReportShape);
};

export const fetchReportSummary = async () => {
  const analyses = await api.analysis.getHistory();
  const completed = analyses.filter((analysis) => analysis.status === "completed");
  const totalScore = completed.reduce((sum, analysis) => sum + (analysis.performanceScore || 0), 0);

  return {
    count: analyses.length,
    completedCount: completed.length,
    averageScore: completed.length ? Math.round(totalScore / completed.length) : 0,
    totalSpend: 0,
    latestReport: completed[0] ? toLegacyReportShape(completed[0]) : null
  };
};

export const fetchLatestAnalysis = async () => {
  const analyses = await api.analysis.getHistory();
  const latestCompleted = analyses.find((analysis) => analysis.status === "completed");

  if (!latestCompleted) {
    return null;
  }

  return api.analysis.getResults(latestCompleted.jobId).then(toLegacyReportShape);
};

export const deleteReport = async (id) => {
  return api.analysis.deleteAnalysis(id);
};
