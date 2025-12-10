import { BadgeDollarSign, MousePointerClick, Percent, Target, Users } from "lucide-react";
import { AnomalyList } from "./AnomalyList.jsx";
import { CampaignTable } from "./CampaignTable.jsx";
import { CampaignSpendChart, TrendChart } from "./ChartPanel.jsx";
import { InsightsList } from "./InsightsList.jsx";
import { MetricCard } from "./MetricCard.jsx";
import {
  formatCurrency,
  formatDecimalCurrency,
  formatNumber,
  formatPercent
} from "../utils/formatters.js";

export const ReportOverview = ({ report }) => {
  const totals = report?.totals || {};

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Spend"
          value={formatCurrency(totals.cost)}
          helper={`${formatDecimalCurrency(totals.cpc)} avg. CPC`}
          icon={BadgeDollarSign}
          tone="text-signal"
        />
        <MetricCard
          label="Impressions"
          value={formatNumber(totals.impressions)}
          helper={`${formatPercent(totals.ctr)} CTR`}
          icon={Users}
          tone="text-zinc-600"
        />
        <MetricCard
          label="Clicks"
          value={formatNumber(totals.clicks)}
          helper="Qualified traffic volume"
          icon={MousePointerClick}
          tone="text-amber"
        />
        <MetricCard
          label="Conversions"
          value={formatNumber(totals.conversions)}
          helper={`${formatPercent(totals.conversionRate)} conv. rate`}
          icon={Target}
          tone="text-signal"
        />
        <MetricCard
          label="CPA"
          value={formatDecimalCurrency(totals.cpa)}
          helper="Cost per conversion"
          icon={Percent}
          tone="text-rose"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TrendChart data={report.dailyTrend || []} />
        <CampaignSpendChart data={report.campaigns || []} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <InsightsList recommendations={report.recommendations || []} />
        <AnomalyList anomalies={report.anomalies || []} />
      </div>

      <CampaignTable campaigns={report.campaigns || []} />
    </div>
  );
};

