import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export function Header({ selectedKegiatan }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 sticky top-0 z-30"
      style={{
        background: 'rgba(13,16,24,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left: Dashboard label + proker name */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          <span className="text-xs text-gold-400 font-medium tracking-wide">Dashboard Kegiatan</span>
        </div>
        <h1 className="text-xl font-bold text-white leading-tight">
          {selectedKegiatan?.Nama_Kegiatan || 'DigiDashboard'}
        </h1>
      </div>

      {/* Right: Logo */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-white">HIMA BISDIG</div>
          <div className="text-[10px] text-muted-foreground">FEB UNM</div>
        </div>
        <img
          src="/Logo_HIMA.png"
          alt="Logo HIMA"
          className="w-11 h-11 rounded-full object-cover ring-2 ring-gold-500/40 shadow-glow"
        />
      </div>
    </header>
  );
}
