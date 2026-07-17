import React, { useMemo } from 'react';
import { Users, BookOpen, CheckCircle, TrendingUp, Star, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import {
  kegiatan, getSummaryStats, getFeedbackByKegiatan, getPesertaByKegiatan,
  computeKPIs, round2, getTOTKelulusan,
} from '../utils/dataUtils';

function StatCard({ title, value, subtitle, icon: Icon, color = '#d4a017' }) {
  return (
    <div
      className="glass-card p-4 flex items-start gap-4"
    >
      <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs font-semibold text-white/90 mt-0.5">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#f5c842', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.color, fontSize: 12 }}>{p.name}: <strong>{p.value?.toFixed ? p.value.toFixed(2) : p.value}</strong></p>)}
      </div>
    );
  }
  return null;
};

export default function SummaryData() {
  const stats = useMemo(() => getSummaryStats(), []);

  // Per-kegiatan summary
  const perKegiatan = useMemo(() => kegiatan.map(kg => {
    const kpis = computeKPIs(kg.ID_Kegiatan);
    const ps = getPesertaByKegiatan(kg.ID_Kegiatan);
    const totKelulusan = getTOTKelulusan(kg.ID_Kegiatan);
    return {
      id: kg.ID_Kegiatan,
      nama: kg.Nama_Kegiatan,
      jenis: kg.Jenis_Kegiatan,
      status: kg.Status,
      peserta: kpis.totalPeserta,
      avgPre: kpis.avgPre,
      avgPost: kpis.avgPost,
      gain: kpis.gain,
      gainPct: kpis.gainPct,
      kepuasan: kpis.avgKepuasan,
      hasTest: kpis.hasTest,
      isTOT: kg.ID_Kegiatan === 'KGT003',
      totKelulusan,
    };
  }), []);

  const barDataPeserta = perKegiatan.map(k => ({
    name: k.nama.length > 14 ? k.nama.substring(0, 12) + '…' : k.nama,
    fullName: k.nama,
    Peserta: k.peserta,
  }));

  const barDataRating = perKegiatan.filter(k => k.kepuasan !== null).map(k => ({
    name: k.nama.length > 14 ? k.nama.substring(0, 12) + '…' : k.nama,
    fullName: k.nama,
    Rating: k.kepuasan,
  }));

  const colors = ['#d4a017', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="flex flex-col gap-5 animate-on-load">
      <div>
        <h2 className="text-xl font-bold text-white">Summary Data</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Ringkasan keseluruhan data dari semua kegiatan HIMA BISDIG</p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Peserta" value={stats.totalPeserta} subtitle="Semua kegiatan" icon={Users} color="#d4a017" />
        <StatCard title="Total Kegiatan" value={stats.totalKeg} subtitle="Proker & Agenda" icon={BookOpen} color="#3b82f6" />
        <StatCard title="Kegiatan Selesai" value={stats.selesai} subtitle={`dari ${stats.totalKeg} kegiatan`} icon={CheckCircle} color="#10b981" />
        <StatCard title="Avg Pre Test" value={stats.overallPre || 'N/A'} subtitle="Semua kegiatan" icon={TrendingUp} color="#8b5cf6" />
        <StatCard title="Avg Post Test" value={stats.overallPost || 'N/A'} subtitle="Semua kegiatan" icon={TrendingUp} color="#f59e0b" />
        <StatCard title="Avg Rating" value={stats.overallRating ? `${stats.overallRating}/5` : 'N/A'} subtitle="Overall kepuasan" icon={Star} color="#ec4899" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-gold-400" />
            <span className="text-sm font-semibold text-white">Jumlah Peserta per Kegiatan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barDataPeserta} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="Peserta" radius={[6, 6, 0, 0]}>
                {barDataPeserta.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-gold-400" />
            <span className="text-sm font-semibold text-white">Rating Kepuasan per Kegiatan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barDataRating} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="Rating" radius={[6, 6, 0, 0]}>
                {barDataRating.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-kegiatan table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/06">
          <span className="text-sm font-semibold text-white">Tabel Ringkasan per Kegiatan</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Kegiatan</th>
                <th>Jenis</th>
                <th>Status</th>
                <th>Peserta</th>
                <th>Avg Pre Test</th>
                <th>Avg Post Test</th>
                <th>Gain (%)</th>
                <th>Rating Kepuasan</th>
                <th>Lulusan</th>
              </tr>
            </thead>
            <tbody>
              {perKegiatan.map((kg, i) => (
                <tr key={i}>
                  <td className="font-medium text-white">{kg.nama}</td>
                  <td>
                    <span className={kg.jenis === 'Proker' ? 'badge-gold' : 'badge-blue'}>{kg.jenis}</span>
                  </td>
                  <td>
                    <span style={{ color: kg.status === 'Selesai' ? '#10b981' : '#f59e0b' }}>
                      {kg.status}
                    </span>
                  </td>
                  <td className="font-semibold text-white">{kg.peserta}</td>
                  <td>{kg.avgPre ?? <span className="text-muted-foreground">—</span>}</td>
                  <td>{kg.avgPost ?? <span className="text-muted-foreground">—</span>}</td>
                  <td>
                    {kg.gainPct !== null
                      ? <span className="font-semibold" style={{ color: kg.gainPct > 0 ? '#10b981' : '#f87171' }}>
                          {kg.gainPct > 0 ? '+' : ''}{kg.gainPct}%
                        </span>
                      : <span className="text-muted-foreground">—</span>
                    }
                  </td>
                  <td>
                    {kg.kepuasan !== null
                      ? <span className="font-semibold text-gold-400">{kg.kepuasan}/5</span>
                      : <span className="text-muted-foreground">—</span>
                    }
                  </td>
                  <td>
                    {kg.isTOT && kg.totKelulusan
                      ? <span
                          className="font-semibold"
                          style={{ color: kg.totKelulusan.pctLulus >= 80 ? '#10b981' : '#f59e0b' }}
                        >
                          {kg.totKelulusan.lulus}/{kg.totKelulusan.total} ({kg.totKelulusan.pctLulus}%)
                        </span>
                      : <span className="text-muted-foreground">—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
