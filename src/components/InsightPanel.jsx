import React, { useState } from 'react';
import { TrendingUp, Star, Lightbulb, Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const iconMap = {
  success: { Icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  star: { Icon: Star, color: '#f5c842', bg: 'rgba(245,200,66,0.15)' },
  tip: { Icon: Lightbulb, color: '#d4a017', bg: 'rgba(212,160,23,0.15)' },
  info: { Icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  warning: { Icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
};

export function InsightPanel({ insights }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? insights : insights.slice(0, 3);

  return (
    <div className="glass-card p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-gold-400" />
          <span className="text-sm font-semibold text-white">Insight & Rekomendasi</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-slow" />
      </div>

      <div className="flex flex-col gap-3">
        {displayed.map((insight, i) => {
          const { Icon, color, bg } = iconMap[insight.type] || iconMap.info;
          return (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg transition-all hover:bg-white/5"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon size={15} style={{ color }} />
              </div>
              <div>
                <div className="text-xs font-semibold mb-0.5" style={{ color }}>
                  {insight.title}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {insight.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {insights.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors mt-1 font-medium"
        >
          {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showAll ? 'Sembunyikan' : `Lihat Semua Insight (${insights.length})`}
        </button>
      )}
    </div>
  );
}
