import React, { useState, useMemo } from 'react';
import {
  Users, ClipboardList, TrendingUp, Award, Star,
  Info, ChevronDown, Layers, GraduationCap, ClipboardCheck
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { ScoreDistributionBarChart, FeedbackBarChart } from '../components/charts/BarCharts';
import { ImprovementDonutChart } from '../components/charts/DonutChart';
import { FeedbackRadarChart } from '../components/charts/RadarChartComp';
import { ScoreTrendLineChart, RatingTrendLineChart } from '../components/charts/LineCharts';
import { InsightPanel } from '../components/InsightPanel';
import { ExportButton } from '../components/ExportButton';
import {
  computeKPIs,
  getScoreDistributionChart,
  getImprovementDonutData,
  getTOTKelulusanDonutData,
  getFeedbackRadarData,
  getScoreTrendAllData,
  getRatingTrendAllData,
  getFeedbackBarData,
  getFeedbackRatingDonutData,
  generateInsights,
  getKegiatanById,
  getAllDataTable,
} from '../utils/dataUtils';

function ChartCard({ title, children, badge, className = '' }) {
  return (
    <div className={`glass-card p-4 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{title}</span>
          <Info size={13} className="text-muted-foreground cursor-help" />
        </div>
        {badge && (
          <span className="badge-gold">{badge}</span>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

function NoDataPlaceholder({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
      <Layers size={28} className="opacity-40" />
      <p className="text-xs text-center">{message}</p>
    </div>
  );
}

export default function Dashboard({ selectedKegiatanId }) {
  const kg = getKegiatanById(selectedKegiatanId);
  const kpis = useMemo(() => computeKPIs(selectedKegiatanId), [selectedKegiatanId]);
  const scoreDistData = useMemo(() => getScoreDistributionChart(selectedKegiatanId), [selectedKegiatanId]);
  const donutData = useMemo(() => getImprovementDonutData(selectedKegiatanId), [selectedKegiatanId]);
  const totDonutData = useMemo(() => getTOTKelulusanDonutData(selectedKegiatanId), [selectedKegiatanId]);
  const radarData = useMemo(() => getFeedbackRadarData(selectedKegiatanId), [selectedKegiatanId]);
  const scoreTrend = useMemo(() => getScoreTrendAllData(), []);
  const ratingTrend = useMemo(() => getRatingTrendAllData(), []);
  const feedbackBarData = useMemo(() => getFeedbackBarData(selectedKegiatanId), [selectedKegiatanId]);
  const feedbackDonutData = useMemo(() => getFeedbackRatingDonutData(selectedKegiatanId), [selectedKegiatanId]);
  const insights = useMemo(() => generateInsights(selectedKegiatanId), [selectedKegiatanId]);
  const tableData = useMemo(() => getAllDataTable(), []);

  // ── KPI Cards ────────────────────────────────────────────────────────────────
  const kpiCards = useMemo(() => {
    const cards = [];

    // ── Card 1: Peserta ───────────────────────────────────────────────────────
    if (kpis.isTOT && kpis.totKelulusan) {
      const { lulus, total, pctLulus } = kpis.totKelulusan;
      cards.push({
        title: 'Total Peserta TOT',
        value: total,
        subtitle: `Lulus: ${lulus}/${total} (${pctLulus}%) — Target ≥80%`,
        icon: GraduationCap,
        variant: 'gold',
      });
    } else {
      cards.push({
        title: 'Total Peserta',
        value: kpis.totalPeserta,
        subtitle: `Target: ${kpis.targetPeserta}`,
        icon: Users,
        variant: 'gold',
      });
    }

    // ── Card 2: Nilai Pre Test / Rating Materi / Jenis Kegiatan ──────────────
    if (kpis.hasTest) {
      cards.push({
        title: 'Rata-rata Pre Test',
        value: kpis.avgPre,
        subtitle: `Kategori: ${kpis.preLabel}`,
        icon: ClipboardList,
        variant: 'gold',
      });
    } else if (kpis.ratingMateri !== null) {
      cards.push({
        title: 'Rating Materi',
        value: `${kpis.ratingMateri}/5`,
        subtitle: kpis.ratingMateri >= 4.5 ? 'Kategori: Sangat Baik' : kpis.ratingMateri >= 4.0 ? 'Kategori: Baik' : 'Kategori: Cukup',
        icon: ClipboardList,
        variant: 'dark',
      });
    } else {
      cards.push({
        title: 'Jenis Kegiatan',
        value: kpis.jenisKegiatan,
        subtitle: `Penyelenggara: ${kpis.penyelenggara ?? 'HIMA BISDIG FEB UNM'}`,
        icon: ClipboardList,
        variant: 'dark',
      });
    }

    // ── Card 3: Nilai Post Test / Rating Pemateri / Jumlah Pelaksanaan ────────
    if (kpis.hasTest) {
      cards.push({
        title: 'Rata-rata Post Test',
        value: kpis.avgPost,
        subtitle: `Kategori: ${kpis.postLabel}`,
        icon: Award,
        variant: 'dark',
      });
    } else if (kpis.ratingPemateri !== null) {
      cards.push({
        title: 'Rating Pemateri',
        value: `${kpis.ratingPemateri}/5`,
        subtitle: kpis.ratingPemateri >= 4.5 ? 'Kategori: Sangat Baik' : kpis.ratingPemateri >= 4.0 ? 'Kategori: Baik' : 'Kategori: Cukup',
        icon: Award,
        variant: 'blue',
      });
    } else {
      cards.push({
        title: 'Jumlah Pelaksanaan',
        value: kpis.jumlahPelaksanaan ?? 1,
        subtitle: `Sesi — ${kpis.namaKegiatan}`,
        icon: Award,
        variant: 'dark',
      });
    }

    // ── Card 4: Gain / CSC Project / Status Kegiatan ─────────────────────────
    if (kpis.hasTest) {
      cards.push({
        title: 'Peningkatan (Gain)',
        value: kpis.gain,
        subtitle: `▲ ${kpis.gainPct}% peningkatan`,
        icon: TrendingUp,
        variant: 'dark',
        trend: kpis.gainPct,
      });
    } else if (kpis.isCSC && kpis.cscPengumpulanProject) {
      const { dikumpulkan, total } = kpis.cscPengumpulanProject;
      cards.push({
        title: 'Pengumpulan Project',
        value: `${dikumpulkan}/${total}`,
        subtitle: `${Math.round((dikumpulkan / total) * 100)}% peserta mengumpulkan`,
        icon: ClipboardCheck,
        variant: 'dark',
      });
    } else {
      cards.push({
        title: 'Status Kegiatan',
        value: kpis.status === 'Selesai' ? 'Selesai' : 'Berjalan',
        subtitle: `${kpis.jenisKegiatan} — ${kpis.jumlahPelaksanaan ?? 1} sesi`,
        icon: TrendingUp,
        variant: kpis.status === 'Selesai' ? 'dark' : 'dark',
      });
    }

    // ── Card 5: Kepuasan Peserta ──────────────────────────────────────────────
    cards.push({
      title: 'Kepuasan Peserta',
      value: kpis.avgKepuasan !== null ? `${kpis.avgKepuasan}` : 'N/A',
      subtitle: kpis.avgKepuasan !== null ? `Kategori: ${kpis.kepuasanKategori}` : 'Data tidak tersedia',
      icon: Star,
      variant: 'dark',
    });

    return cards;
  }, [kpis]);


  return (
    <div className="flex flex-col gap-5 animate-on-load">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{kg.Jenis_Kegiatan}</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: kg.Status === 'Selesai' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                color: kg.Status === 'Selesai' ? '#10b981' : '#f59e0b',
              }}
            >
              {kg.Status}
            </span>
          </div>
        </div>
        <ExportButton selectedKegiatan={kg} kpis={kpis} tableData={tableData} />
      </div>

      {/* ── KPI Cards Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpiCards.map((card, i) => (
          <KPICard key={i} {...card} />
        ))}
      </div>

      {/* ── Charts Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Score Distribution or Feedback Bar */}
        <div className="lg:col-span-2">
          <ChartCard
            title={kpis.hasTest ? 'Perbandingan Nilai Pre Test dan Post Test' : 'Rating per Aspek Kegiatan'}
            badge={kpis.hasTest ? 'Distribusi Nilai' : 'Feedback'}
          >
            {kpis.hasTest ? (
              scoreDistData.some(d => d['Pre Test'] > 0 || d['Post Test'] > 0)
                ? <ScoreDistributionBarChart data={scoreDistData} />
                : <NoDataPlaceholder message="Tidak ada data tes untuk kegiatan ini" />
            ) : (
              feedbackBarData.length > 0
                ? <FeedbackBarChart data={feedbackBarData} />
                : <NoDataPlaceholder message="Tidak ada data feedback untuk kegiatan ini" />
            )}
          </ChartCard>
        </div>

        {/* Chart 2: Donut */}
        <ChartCard
          title={kpis.isTOT ? 'Status Kelulusan Peserta TOT' : kpis.hasTest ? 'Persentase Peningkatan Nilai Peserta' : 'Distribusi Rating Kepuasan'}
          badge={kpis.isTOT ? 'KPI Lulusan' : kpis.hasTest ? 'Gain Analysis' : 'Kepuasan'}
        >
          {kpis.isTOT ? (
            totDonutData.some(d => d.value > 0)
              ? <ImprovementDonutChart
                  data={totDonutData}
                  totalLabel="Peserta"
                  totalValue={kpis.totKelulusan?.total ?? 0}
                />
              : <NoDataPlaceholder message="Tidak ada data kelulusan TOT" />
          ) : kpis.hasTest ? (
            donutData.some(d => d.value > 0)
              ? <ImprovementDonutChart
                  data={donutData}
                  totalLabel="Peserta"
                  totalValue={kpis.totalPeserta}
                />
              : <NoDataPlaceholder message="Tidak ada data peningkatan" />
          ) : (
            feedbackDonutData.some(d => d.value > 0)
              ? <ImprovementDonutChart
                  data={feedbackDonutData}
                  totalLabel="Responden"
                  totalValue={kpis.hasFeedback ? feedbackDonutData.reduce((a, b) => a + b.value, 0) : 0}
                />
              : <NoDataPlaceholder message="Tidak ada data feedback" />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 3: Radar */}
        <ChartCard title="Kepuasan Peserta per Aspek" badge="Rating">
          {radarData.length > 0 ? (
            <FeedbackRadarChart data={radarData} />
          ) : (
            <NoDataPlaceholder message="Tidak ada data feedback aspek untuk kegiatan ini" />
          )}
        </ChartCard>

        {/* Chart 4: Line Trend */}
        <div className="lg:col-span-2">
          <ChartCard
            title={kpis.hasTest ? 'Tren Nilai Rata-rata' : 'Tren Rating Kegiatan'}
            badge="Per Agenda"
          >
            {kpis.hasTest ? (
              scoreTrend.length > 0
                ? <ScoreTrendLineChart data={scoreTrend} />
                : <NoDataPlaceholder message="Tidak ada data tren tes" />
            ) : (
              ratingTrend.length > 0
                ? <RatingTrendLineChart data={ratingTrend} />
                : <NoDataPlaceholder message="Tidak ada data tren rating" />
            )}
          </ChartCard>
        </div>
      </div>

      {/* Insight Panel */}
      <InsightPanel insights={insights} />

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pb-2">
        © Himpunan Mahasiswa Bisnis Digital FEB UNM
      </div>
    </div>
  );
}
