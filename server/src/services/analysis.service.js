import { parseGoogleAdsCsv } from "./csv.service.js";
import { analyzeCampaignPerformance } from "./diagnostic.service.js";
import { generateRecommendations } from "./gemini.service.js";
import { createReport } from "./report.service.js";

export const analyzeUploadedCsv = async ({ filePath, originalName, userId = null }) => {
  const rows = await parseGoogleAdsCsv(filePath);
  const analysis = analyzeCampaignPerformance(rows);
  const recommendations = await generateRecommendations(analysis);

  return createReport({
    uploadedBy: userId || null,
    sourceFile: originalName || "google-ads-export.csv",
    rowCount: rows.length,
    ...analysis,
    recommendations
  });
};

