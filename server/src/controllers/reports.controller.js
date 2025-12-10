import {
  deleteReportById,
  getReportById,
  listReports,
  summarizeReports
} from "../services/report.service.js";

export const listReportHistory = async (req, res) => {
  const reports = await listReports({
    userId: req.user?.id || null,
    limit: req.query.limit
  });
  res.json({ reports });
};

export const getReportSummary = async (req, res) => {
  const summary = await summarizeReports({
    userId: req.user?.id || null
  });
  res.json({ summary });
};

export const getReport = async (req, res) => {
  const report = await getReportById(req.params.id, req.user?.id || null);
  res.json({ report });
};

export const deleteReport = async (req, res) => {
  const report = await deleteReportById(req.params.id, req.user?.id || null);
  res.json({
    deleted: true,
    report
  });
};

