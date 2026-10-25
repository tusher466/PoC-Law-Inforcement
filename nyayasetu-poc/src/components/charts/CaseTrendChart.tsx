import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const MOCK_TREND_DATA = [
  { month: 'মে', theft: 124, fraud: 45, lost: 210, harassment: 32 },
  { month: 'জুন', theft: 110, fraud: 62, lost: 195, harassment: 48 },
  { month: 'জুলাই', theft: 98, fraud: 78, lost: 180, harassment: 54 },
  { month: 'আগস্ট', theft: 85, fraud: 89, lost: 220, harassment: 39 },
  { month: 'সেপ্টে', theft: 92, fraud: 104, lost: 240, harassment: 61 },
  { month: 'অক্টো', theft: 78, fraud: 118, lost: 265, harassment: 58 },
];

export const CaseTrendChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={MOCK_TREND_DATA}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#006A4E" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#006A4E" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0E7C86" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0E7C86" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorTheft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            name="হারানো বিজ্ঞপ্তি"
            dataKey="lost"
            stroke="#006A4E"
            fillOpacity={1}
            fill="url(#colorLost)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            name="সাইবার প্রতারণা"
            dataKey="fraud"
            stroke="#0E7C86"
            fillOpacity={1}
            fill="url(#colorFraud)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            name="চুরি / ছিনতাই"
            dataKey="theft"
            stroke="#ea580c"
            fillOpacity={1}
            fill="url(#colorTheft)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
