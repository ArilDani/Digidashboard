import React from 'react';
import { LayoutDashboard, Table2, BarChart3, Calendar, ChevronRight } from 'lucide-react';
import { kegiatan } from '../utils/dataUtils';
import { cn } from '../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'dataproker', label: 'Data Proker', Icon: Table2 },
  { id: 'summary', label: 'Summary', Icon: BarChart3 },
];

const statusColors = {
  'Selesai': '#10b981',
  'belum selesai': '#f59e0b',
};

export function Sidebar({ activePage, onPageChange, selectedKegiatanId, onKegiatanChange }) {
  return (
    <aside
      className="flex flex-col h-screen sticky top-0"
      style={{
        width: 220,
        minWidth: 220,
        background: 'linear-gradient(180deg, #111520 0%, #0d1018 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo / Branding */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/06">
        <img src="/Logo_HIMA.png" alt="Logo" className="w-10 h-10 rounded-full object-cover ring-2 ring-gold-500/40" />
        <div>
          <div className="text-sm font-bold text-white leading-tight">DigiDashboard</div>
          <div className="text-[10px] text-muted-foreground leading-tight">Ekosistem 1</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 pt-4 pb-2">
        <p className="section-title px-2 text-[10px]">Menu Utama</p>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onPageChange(id)}
              className={cn('sidebar-item text-sm', activePage === id && 'active')}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Proker Selector */}
      <div className="px-3 pt-3 pb-2 flex-1 overflow-y-auto">
        <p className="section-title px-2 text-[10px]">Pilih Proker</p>
        <div className="flex flex-col gap-1">
          {kegiatan.map((kg) => {
            const isActive = kg.ID_Kegiatan === selectedKegiatanId;
            return (
              <button
                key={kg.ID_Kegiatan}
                onClick={() => onKegiatanChange(kg.ID_Kegiatan)}
                className={cn(
                  'flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group',
                  isActive
                    ? 'bg-white/08 border border-white/10'
                    : 'hover:bg-white/04'
                )}
              >
                <Calendar size={13} className={cn('mt-0.5 flex-shrink-0', isActive ? 'text-gold-400' : 'text-muted-foreground')} />
                <div className="flex-1 min-w-0">
                  <div className={cn('text-xs font-medium leading-tight truncate', isActive ? 'text-white' : 'text-slate-300')}>
                    {kg.Nama_Kegiatan}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: statusColors[kg.Status] || '#6b7280' }}
                    />
                    <span className="text-[10px] text-muted-foreground truncate">{kg.Jenis_Kegiatan}</span>
                  </div>
                </div>
                {isActive && <ChevronRight size={12} className="text-gold-400 flex-shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/06">
        <div
          className="rounded-xl p-3 text-xs"
          style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.15)' }}
        >
          <div className="font-semibold text-gold-400 mb-0.5">HIMA BISDIG</div>
          <div className="text-muted-foreground text-[10px] leading-relaxed">FEB UNM — Ekosistem 1</div>
        </div>
      </div>
    </aside>
  );
}
