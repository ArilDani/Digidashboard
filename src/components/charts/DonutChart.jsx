import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div style={{ background: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', maxWidth: 200 }}>
        <p style={{ color: d.payload.color || '#f5c842', fontWeight: 600, fontSize: 11, marginBottom: 4 }}>{d.name}</p>
        <p style={{ color: '#fff', fontSize: 12 }}>Jumlah: <strong>{d.value}</strong></p>
        <p style={{ color: '#94a3b8', fontSize: 11 }}>{d.payload.pct}% dari total</p>
      </div>
    );
  }
  return null;
};

export function ImprovementDonutChart({ data, totalLabel, totalValue }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: 220, gap: 8 }}>

      {/* Pie chart column */}
      <div style={{ position: 'relative', flexShrink: 0, width: 160, height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label — absolutely positioned inside the relative wrapper */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          lineHeight: 1.2,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{totalValue}</div>
          <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{totalLabel}</div>
        </div>
      </div>

      {/* Legend column — takes remaining space, scrolls if needed */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        overflow: 'hidden',
      }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0 }}>
            <div style={{
              width: 9, height: 9,
              borderRadius: '50%',
              background: d.color,
              flexShrink: 0,
              marginTop: 2,
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#cbd5e1', lineHeight: 1.35, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {d.name}
              </div>
              <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginTop: 1 }}>
                {d.value}{' '}
                <span style={{ color: '#94a3b8', fontWeight: 400 }}>({d.pct}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
