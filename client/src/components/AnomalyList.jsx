import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { formatNumber, formatPercent, severityTone } from "../utils/formatters.js";

const DirectionIcon = ({ direction }) => {
  if (direction === "up") {
    return <TrendingUp className="h-4 w-4" aria-hidden="true" />;
  }
  return <TrendingDown className="h-4 w-4" aria-hidden="true" />;
};

export const AnomalyList = ({ anomalies = [] }) => (
  <section className="panel p-6">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium uppercase text-zinc-500">Anomalies</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">Week-over-week movement</h2>
      </div>
      <AlertTriangle className="h-5 w-5 text-amber" aria-hidden="true" />
    </div>
    <div className="space-y-3">
      {anomalies.length > 0 ? (
        anomalies.map((anomaly) => (
          <article key={`${anomaly.entity}-${anomaly.metric}-${anomaly.changePercent}`} className="rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">{anomaly.label}</h3>
                <p className="text-sm text-zinc-500">{anomaly.entity}</p>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${severityTone(anomaly.severity)}`}>
                <DirectionIcon direction={anomaly.direction} />
                {formatPercent(anomaly.changePercent)}
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600">
              {formatNumber(anomaly.previous)} to {formatNumber(anomaly.current)}
            </p>
          </article>
        ))
      ) : (
        <p className="rounded-lg bg-cloud p-4 text-sm text-zinc-500">No material movement detected.</p>
      )}
    </div>
  </section>
);

