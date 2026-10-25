import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

const SLA_DATA = [
  { name: 'ধানমন্ডি', compliance: 96 },
  { name: 'গুলশান', compliance: 98 },
  { name: 'রমনা', compliance: 92 },
  { name: 'উত্তরা পূর্ব', compliance: 90 },
  { name: 'মিরপুর মডেল', compliance: 88 },
  { name: 'সাভার মডেল', compliance: 84 },
];

export const SlaChart: React.FC = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={SLA_DATA}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
          <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} width={80} />
          <Tooltip
            formatter={(value: any) => [`${value}% প্রতিপালন`, 'এসএলএ অনুপালন হার']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="compliance" radius={[0, 8, 8, 0]} barSize={18}>
            {SLA_DATA.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.compliance >= 95
                    ? '#006A4E'
                    : entry.compliance >= 90
                    ? '#0E7C86'
                    : '#ea580c'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
