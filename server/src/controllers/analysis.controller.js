import { getReportById, listReports } from "../services/report.service.js";

export const listAnalyses = async (req, res) => {
  const reports = await listReports({
    userId: req.user?.id || null,
    limit: req.query.limit
  });
  res.json({ reports });
};

export const getAnalysis = async (req, res) => {
  const report = await getReportById(req.params.id, req.user?.id || null);
  res.json({ report });
};

export const getLatestAnalysis = async (req, res) => {
  const reports = await listReports({
    userId: req.user?.id || null,
    limit: 1
  });
  res.json({ report: reports[0] || null });
};

