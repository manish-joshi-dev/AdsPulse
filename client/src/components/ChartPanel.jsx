import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency, formatDate, formatNumber } from "../utils/formatters.js";

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #e4e4e7",
  boxShadow: "0 12px 30px rgba(32, 33, 36, 0.12)"
};

export const TrendChart = ({ data = [] }) => (
  <section className="panel p-6">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium uppercase text-zinc-500">Trend</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">Daily clicks and conversions</h2>
      </div>
    </div>
    <div className="h-80 w-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 18, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#eceff3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} tickLine={false} axisLine={false} minTickGap={24} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={formatNumber} width={48} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={formatDate}
              formatter={(value, name) => [formatNumber(value), name]}
            />
            <Line type="monotone" dataKey="clicks" stroke="#0f9d8f" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="conversions" stroke="#f5a524" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center rounded-lg bg-cloud text-sm text-zinc-500">
          No dated rows found.
        </div>
      )}
    </div>
  </section>
);

export const CampaignSpendChart = ({ data = [] }) => (
  <section className="panel p-6">
    <div className="mb-5">
      <p className="text-sm font-medium uppercase text-zinc-500">Campaigns</p>
      <h2 className="mt-1 text-xl font-semibold text-ink">Spend by top campaigns</h2>
    </div>
    <div className="h-80 w-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.slice(0, 8)} margin={{ top: 8, right: 18, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#eceff3" vertical={false} />
            <XAxis dataKey="campaign" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={formatCurrency} width={70} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [name === "cost" ? formatCurrency(value) : formatNumber(value), name]}
            />
            <Bar dataKey="cost" fill="#0f9d8f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center rounded-lg bg-cloud text-sm text-zinc-500">
          No campaign rows found.
        </div>
      )}
    </div>
  </section>
);

