import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a2744',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '8px 12px',
      }}>
        <p style={{ color: '#f5c842', fontSize: 12, fontWeight: 600 }}>
          {payload[0]?.payload?.aspect}
        </p>
        <p style={{ color: '#fff', fontSize: 12 }}>
          Rating: <strong>{payload[0]?.value?.toFixed(2)}</strong>/5
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Custom tick for PolarAngleAxis:
 * Renders the aspect name on one line and the value (bold, gold) below it,
 * matching the reference design.
 */
const CustomAngleTick = ({ x, y, payload, cx, cy, data }) => {
  // Find the value for this aspect from our data array
  const entry = data?.find(d => d.aspect === payload.value);
  const val = entry?.value != null ? entry.value.toFixed(2) : '';

  // Determine text-anchor based on horizontal position relative to center
  const dx = x - cx;
  const anchor = dx > 10 ? 'start' : dx < -10 ? 'end' : 'middle';

  // Nudge labels a bit further from center so they don't overlap the dot
  const OFFSET = 12;
  const nx = dx > 10 ? x + OFFSET * 0.4 : dx < -10 ? x - OFFSET * 0.4 : x;
  const ny = y;

  return (
    <g>
      {/* Value — displayed prominently above/near the label */}
      <text
        x={nx}
        y={ny - 2}
        textAnchor={anchor}
        dominantBaseline="auto"
        fill="#d4a017"
        fontSize={13}
        fontWeight={700}
      >
        {val}
      </text>
      {/* Aspect name — smaller, muted, below the value */}
      <text
        x={nx}
        y={ny + 13}
        textAnchor={anchor}
        dominantBaseline="hanging"
        fill="#94a3b8"
        fontSize={10}
      >
        {payload.value}
      </text>
    </g>
  );
};

export function FeedbackRadarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius={72}
        data={data}
      >
        {/* Subtle grid lines */}
        <PolarGrid
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="3 3"
        />

        {/* Hide built-in radius axis numbers — they clutter the design */}
        <PolarRadiusAxis
          domain={[0, 5]}
          tick={false}
          axisLine={false}
        />

        {/* Custom angle tick with name + value */}
        <PolarAngleAxis
          dataKey="aspect"
          tick={(tickProps) => (
            <CustomAngleTick {...tickProps} cx={tickProps.cx} cy={tickProps.cy} data={data} />
          )}
          tickLine={false}
        />

        <Radar
          name="Rating"
          dataKey="value"
          stroke="#d4a017"
          strokeWidth={2}
          fill="#d4a017"
          fillOpacity={0.35}
          dot={{ fill: '#d4a017', r: 5, strokeWidth: 0 }}
          activeDot={{ fill: '#f5c842', r: 6 }}
        />

        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
