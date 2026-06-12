import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const TrendLineChart = ({ data, lines }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      {lines.map((line, i) => (
        <Line key={i} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      ))}
    </LineChart>
  </ResponsiveContainer>
);
