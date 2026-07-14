import React from 'react';
import { cn } from '../lib/utils';

// ── Generic card base ─────────────────────────────────────────────────────────
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('glass-card', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ── KPI Card (individual) ──────────────────────────────────────────────────────
export function KPICard({ title, value, subtitle, icon: Icon, variant = 'dark', trend, trendLabel }) {
  const isGold = variant === 'gold';
  const isBlue = variant === 'blue';
  const isTeal = variant === 'teal';
  const isDark = !isGold && !isBlue && !isTeal;

  return (
    <div
      className={cn(
        'rounded-xl p-5 flex flex-col gap-3 animate-on-load transition-transform hover:-translate-y-0.5 hover:shadow-lg duration-200',
        isGold && 'kpi-card-gold text-dark-100',
        isBlue && 'bg-gradient-to-br from-blue-900/80 to-blue-800/50 border border-blue-700/30',
        isTeal && 'bg-gradient-to-br from-teal-900/80 to-teal-800/50 border border-teal-700/30',
        isDark && 'kpi-card-dark'
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex-1')}>
          <p className={cn(
            'text-xs font-semibold uppercase tracking-wider mb-1',
            isGold ? 'text-amber-900/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <div className={cn(
            'text-3xl font-bold',
            isGold ? 'text-amber-950' : 'text-white'
          )}>
            {value}
          </div>
        </div>
        {Icon && (
          <div className={cn(
            'p-2.5 rounded-lg',
            isGold ? 'bg-amber-900/20' : 'bg-white/10'
          )}>
            <Icon size={22} className={isGold ? 'text-amber-900' : 'text-white/80'} />
          </div>
        )}
      </div>
      {subtitle && (
        <div className={cn(
          'text-xs font-medium',
          isGold ? 'text-amber-900/70' : 'text-muted-foreground'
        )}>
          {subtitle}
        </div>
      )}
      {trend !== undefined && (
        <div className={cn(
          'flex items-center gap-1 text-xs font-semibold',
          trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-muted-foreground'
        )}>
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'}
          {Math.abs(trend)}% {trendLabel}
        </div>
      )}
    </div>
  );
}
