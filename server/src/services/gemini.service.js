import { GoogleGenerativeAI } from "google-generativeai";
import { config } from "../config/env.js";

const fallbackRecommendations = (analysis) => {
  const failedChecks = analysis.checks.filter((check) => check.status !== "pass");
  const recommendations = failedChecks.slice(0, 4).map((check) => ({
    title: check.label,
    priority: check.severity === "high" ? "High" : "Medium",
    rationale: check.message,
    actionItems: [
      "Review affected campaigns and isolate the highest-spend segments.",
      "Adjust bids, budgets, targeting, or creative based on the metric driving the issue.",
      "Re-check the report after the next complete data window."
    ],
    expectedImpact: "Improves spend efficiency and stabilizes campaign health signals."
  }));

  if (recommendations.length < 3) {
    recommendations.push(
      {
        title: "Scale proven campaigns",
        priority: "Medium",
        rationale: "The account has campaigns with healthier efficiency signals than the average.",
        actionItems: [
          "Move incremental budget toward campaigns with above-average score and conversion rate.",
          "Preserve campaign-level CPA guardrails while scaling.",
          "Monitor search terms and placements during the budget shift."
        ],
        expectedImpact: "Increases qualified volume while keeping efficiency controlled."
      },
      {
        title: "Refresh weak CTR assets",
        priority: "Medium",
        rationale: "CTR is a leading signal for audience-message fit and quality score pressure.",
        actionItems: [
          "Test new headlines focused on specific advertiser value propositions.",
          "Add negative keywords or audience exclusions where intent is weak.",
          "Compare ad group CTR before and after creative changes."
        ],
        expectedImpact: "Raises engagement and can reduce average CPC over time."
      }
    );
  }

  return recommendations.slice(0, 5);
};

const extractJsonArray = (text) => {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    return null;
  }

  try {
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const generateRecommendations = async (analysis) => {
  if (!config.geminiApiKey) {
    return fallbackRecommendations(analysis);
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a senior Google Ads performance strategist.
Return JSON only as an array of 3 to 5 recommendation objects.
Each object must contain title, priority, rationale, actionItems, and expectedImpact.
Use the account diagnostics below and make the recommendations specific, tactical, and safe for a paid-search manager.

Diagnostics:
${JSON.stringify(
  {
    score: analysis.performanceScore,
    grade: analysis.grade,
    totals: analysis.totals,
    checks: analysis.checks,
    anomalies: analysis.anomalies,
    topCampaigns: analysis.campaigns.slice(0, 8)
  },
  null,
  2
)}
`;

    const result = await model.generateContent(prompt);
    const parsed = extractJsonArray(result.response.text());
    if (!parsed) {
      return fallbackRecommendations(analysis);
    }

    return parsed.slice(0, 5).map((item) => ({
      title: String(item.title || "Optimization recommendation"),
      priority: String(item.priority || "Medium"),
      rationale: String(item.rationale || "Recommended from the account diagnostics."),
      actionItems: Array.isArray(item.actionItems)
        ? item.actionItems.map(String).slice(0, 5)
        : ["Review the affected campaigns and apply the recommended optimization."],
      expectedImpact: String(item.expectedImpact || "Improves campaign performance.")
    }));
  } catch (error) {
    console.warn(`Gemini recommendation generation failed: ${error.message}`);
    return fallbackRecommendations(analysis);
  }
};

