import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';

export const StationScoreChart: React.FC = () => {
  const stations = useAppStore((s) => s.stations);

  const data = stations.map((s) => ({
    name: s.nameBn.split(' ')[0],
    rating: s.rating,
    active: s.activeCases,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
          <YAxis domain={[0, 5]} stroke="#64748b" fontSize={11} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip
            formatter={(value: any) => [`${value} ★`, 'নাগরিক রেটিং']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="rating" fill="#006A4E" radius={[8, 8, 0, 0]} barSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
