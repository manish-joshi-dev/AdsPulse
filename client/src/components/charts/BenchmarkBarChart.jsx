import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

export const BenchmarkBarChart = ({ data, metricKey, benchmarkValue }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip contentStyle={{ backgroundColor: '#18181b', color: '#fff', border: 'none' }} />
      <ReferenceLine y={benchmarkValue} stroke="red" strokeDasharray="3 3" />
      <Bar dataKey={metricKey} fill="#4f46e5" />
    </BarChart>
  </ResponsiveContainer>
);
