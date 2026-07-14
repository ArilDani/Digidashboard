import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload;
    return (
      <div style={{ background: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', minWidth: 160 }}>
        <p style={{ color: '#f5c842', marginBottom: 6, fontSize: 12, fontWeight: 600 }}>{item?.fullName || label}</p>
        {payload.map((p, i) => (
          p.value !== null && (
            <p key={i} style={{ color: p.color, fontSize: 12 }}>
              {p.name}: <strong>{p.value?.toFixed(1)}</strong>
            </p>
          )
        ))}
      </div>
    );
  }
  return null;
};

export function ScoreTrendLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }} iconType="circle" iconSize={8} />
        <Line
          type="monotone" dataKey="Pre Test" stroke="#d4a017"
          strokeWidth={2.5} dot={{ fill: '#d4a017', r: 5 }} activeDot={{ r: 7 }}
          connectNulls={false}
        />
        <Line
          type="monotone" dataKey="Post Test" stroke="#3b82f6"
          strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 7 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RatingTrendLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }} iconType="circle" iconSize={8} />
        <Line
          type="monotone" dataKey="Rating Overall" stroke="#d4a017"
          strokeWidth={2.5} dot={{ fill: '#d4a017', r: 5 }} activeDot={{ r: 7 }}
          connectNulls={false}
        />
        <Line
          type="monotone" dataKey="Rating Materi" stroke="#3b82f6"
          strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#3b82f6', r: 4 }}
          connectNulls={false}
        />
        <Line
          type="monotone" dataKey="Rating Pemateri" stroke="#10b981"
          strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10b981', r: 4 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
