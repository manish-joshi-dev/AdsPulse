import { api } from "./api.js";

export const uploadCsv = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data.report;
};

export const fetchReports = async () => {
  const { data } = await api.get("/reports");
  return data.reports;
};

export const fetchReport = async (id) => {
  const { data } = await api.get(`/reports/${id}`);
  return data.report;
};

export const fetchReportSummary = async () => {
  const { data } = await api.get("/reports/summary");
  return data.summary;
};

export const fetchLatestAnalysis = async () => {
  const { data } = await api.get("/analysis/latest");
  return data.report;
};

export const deleteReport = async (id) => {
  const { data } = await api.delete(`/reports/${id}`);
  return data;
};

