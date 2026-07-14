import db from '../data/database.json';

export const { kegiatan, peserta, prepost, feedback } = db;

// ── helpers ──────────────────────────────────────────────────────────────────
export const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
export const round2 = (n) => Math.round(n * 100) / 100;
const pctLabel = (v) => {
  if (v >= 80) return 'Sangat Baik';
  if (v >= 70) return 'Baik';
  if (v >= 60) return 'Cukup';
  return 'Perlu Ditingkatkan';
};

// ── per-kegiatan data ─────────────────────────────────────────────────────────
export function getKegiatanById(id) {
  return kegiatan.find((k) => k.ID_Kegiatan === id) || kegiatan[0];
}

export function getPesertaByKegiatan(id) {
  return peserta.filter((p) => p.ID_Kegiatan === id);
}

export function getPrepostByKegiatan(id) {
  return prepost.filter((p) => p.ID_Kegiatan === id && p.Nilai_PreTest !== null && p.Nilai_PostTest !== null);
}

export function getFeedbackByKegiatan(id) {
  return feedback.filter((f) => f.ID_Kegiatan === id);
}

// ── KPI computations ──────────────────────────────────────────────────────────
export function computeKPIs(id) {
  const kg = getKegiatanById(id);
  const ps = getPesertaByKegiatan(id);
  const pt = getPrepostByKegiatan(id);
  const fb = getFeedbackByKegiatan(id);

  const hasTest = pt.length > 0;
  const hasFeedback = fb.length > 0;

  // 1. Total Peserta
  const totalPeserta = ps.length || fb.length;
  const targetPeserta = kg.Target_Peserta;

  // 2. Pre-test avg
  const preVals = pt.map((p) => p.Nilai_PreTest).filter((v) => v !== null);
  const avgPre = hasTest ? round2(avg(preVals)) : null;

  // 3. Post-test avg
  const postVals = pt.map((p) => p.Nilai_PostTest).filter((v) => v !== null);
  const avgPost = hasTest ? round2(avg(postVals)) : null;

  // 4. Gain
  const gain = hasTest ? round2(avgPost - avgPre) : null;
  const gainPct = hasTest && avgPre > 0 ? round2(((avgPost - avgPre) / avgPre) * 100) : null;

  // 5. Kepuasan (overall rating)
  const overallRatings = fb.map((f) => f.Rating_Keseluruhan).filter((v) => v !== null);
  const avgKepuasan = hasFeedback ? round2(avg(overallRatings)) : null;
  const kepuasanKategori = avgKepuasan
    ? avgKepuasan >= 4.5 ? 'Sangat Puas' : avgKepuasan >= 4.0 ? 'Puas' : avgKepuasan >= 3.0 ? 'Cukup Puas' : 'Perlu Ditingkatkan'
    : 'N/A';

  // extra for no-test cards
  const matVals = fb.map((f) => f.Rating_Materi).filter((v) => v !== null);
  const pematVals = fb.map((f) => f.Rating_Pemateri).filter((v) => v !== null);
  const ratingMateri = matVals.length > 0 ? round2(avg(matVals)) : null;
  const ratingPemateri = pematVals.length > 0 ? round2(avg(pematVals)) : null;

  return {
    hasTest, hasFeedback,
    totalPeserta, targetPeserta,
    avgPre, avgPost, gain, gainPct,
    avgKepuasan, kepuasanKategori,
    ratingMateri, ratingPemateri,
    jumlahPelaksanaan: kg.Jumlah_Pelaksanaan,
    jenisKegiatan: kg.Jenis_Kegiatan,
    status: kg.Status,
    preLabel: avgPre !== null ? pctLabel(avgPre) : '',
    postLabel: avgPost !== null ? pctLabel(avgPost) : '',
  };
}

// ── Chart data ────────────────────────────────────────────────────────────────
// Bar: Pre-Post distribution by score range
export function getScoreDistributionChart(id) {
  const pt = getPrepostByKegiatan(id);
  const ranges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
  const rangeBounds = [[0, 20], [21, 40], [41, 60], [61, 80], [81, 100]];
  return ranges.map((label, i) => {
    const [lo, hi] = rangeBounds[i];
    return {
      range: label,
      'Pre Test': pt.filter((p) => p.Nilai_PreTest !== null && p.Nilai_PreTest >= lo && p.Nilai_PreTest <= hi).length,
      'Post Test': pt.filter((p) => p.Nilai_PostTest !== null && p.Nilai_PostTest >= lo && p.Nilai_PostTest <= hi).length,
    };
  });
}

// Donut: improvement category distribution
export function getImprovementDonutData(id) {
  const pt = getPrepostByKegiatan(id);
  let meningkatSignifikan = 0, meningkat = 0, tidakBerubah = 0, menurun = 0;
  pt.forEach((p) => {
    const pct = p.Persentase_Peningkatan;
    if (pct === null) return;
    if (pct > 20) meningkatSignifikan++;
    else if (pct >= 5) meningkat++;
    else if (pct >= -5) tidakBerubah++;
    else menurun++;
  });
  const total = pt.length || 1;
  return [
    { name: 'Meningkat Signifikan (>20%)', value: meningkatSignifikan, pct: round2(meningkatSignifikan/total*100), color: '#d4a017' },
    { name: 'Meningkat (5% - 20%)', value: meningkat, pct: round2(meningkat/total*100), color: '#3b82f6' },
    { name: 'Tidak Berubah (-5% - 5%)', value: tidakBerubah, pct: round2(tidakBerubah/total*100), color: '#6b7280' },
    { name: 'Menurun (< -5%)', value: menurun, pct: round2(menurun/total*100), color: '#ef4444' },
  ];
}

// Radar: feedback ratings per aspect
export function getFeedbackRadarData(id) {
  const fb = getFeedbackByKegiatan(id);
  const safeAvg = (key) => {
    const vals = fb.map((f) => f[key]).filter((v) => v !== null);
    return vals.length ? round2(avg(vals)) : null;
  };
  const aspects = [
    { label: 'Materi', key: 'Rating_Materi' },
    { label: 'Pemateri', key: 'Rating_Pemateri' },
    { label: 'Panitia', key: 'Rating_Panitia' },
    { label: 'Fasilitas', key: 'Rating_Fasilitas' },
  ];
  return aspects
    .map((a) => ({ aspect: a.label, value: safeAvg(a.key) }))
    .filter((a) => a.value !== null);
}

// Line: avg pre/post per kegiatan (all kegiatan that have test)
export function getScoreTrendAllData() {
  const kgsWithTest = kegiatan.filter((kg) => {
    const pt = getPrepostByKegiatan(kg.ID_Kegiatan);
    return pt.length > 0;
  });
  return kgsWithTest.map((kg) => {
    const pt = getPrepostByKegiatan(kg.ID_Kegiatan);
    const pres = pt.map((p) => p.Nilai_PreTest).filter((v) => v !== null);
    const posts = pt.map((p) => p.Nilai_PostTest).filter((v) => v !== null);
    return {
      name: kg.Nama_Kegiatan.length > 16 ? kg.Nama_Kegiatan.substring(0, 14) + '…' : kg.Nama_Kegiatan,
      fullName: kg.Nama_Kegiatan,
      'Pre Test': round2(avg(pres)),
      'Post Test': round2(avg(posts)),
    };
  });
}

// Rating trend all kegiatan
export function getRatingTrendAllData() {
  return kegiatan.map((kg) => {
    const fb = getFeedbackByKegiatan(kg.ID_Kegiatan);
    const overalls = fb.map((f) => f.Rating_Keseluruhan).filter((v) => v !== null);
    const mater = fb.map((f) => f.Rating_Materi).filter((v) => v !== null);
    const pemat = fb.map((f) => f.Rating_Pemateri).filter((v) => v !== null);
    return {
      name: kg.Nama_Kegiatan.length > 16 ? kg.Nama_Kegiatan.substring(0, 14) + '…' : kg.Nama_Kegiatan,
      fullName: kg.Nama_Kegiatan,
      'Rating Overall': overalls.length ? round2(avg(overalls)) : null,
      'Rating Materi': mater.length ? round2(avg(mater)) : null,
      'Rating Pemateri': pemat.length ? round2(avg(pemat)) : null,
    };
  });
}

// Feedback donut for non-test activities (rating distribution)
export function getFeedbackRatingDonutData(id) {
  const fb = getFeedbackByKegiatan(id);
  const buckets = { '5 - Sangat Baik': 0, '4 - Baik': 0, '3 - Cukup': 0, '1-2 - Kurang': 0 };
  fb.forEach((f) => {
    const r = f.Rating_Keseluruhan;
    if (r === null) return;
    if (r >= 5) buckets['5 - Sangat Baik']++;
    else if (r >= 4) buckets['4 - Baik']++;
    else if (r >= 3) buckets['3 - Cukup']++;
    else buckets['1-2 - Kurang']++;
  });
  const total = fb.length || 1;
  const colors = ['#d4a017', '#3b82f6', '#6b7280', '#ef4444'];
  return Object.entries(buckets).map(([name, value], i) => ({
    name, value, pct: round2(value / total * 100), color: colors[i],
  }));
}

// Bar chart for feedback rating per aspect (for non-test kegiatan)
export function getFeedbackBarData(id) {
  const fb = getFeedbackByKegiatan(id);
  const safeAvg = (key) => {
    const vals = fb.map((f) => f[key]).filter((v) => v !== null);
    return vals.length ? round2(avg(vals)) : null;
  };
  const aspects = [
    { label: 'Materi', key: 'Rating_Materi' },
    { label: 'Pemateri', key: 'Rating_Pemateri' },
    { label: 'Panitia', key: 'Rating_Panitia' },
    { label: 'Fasilitas', key: 'Rating_Fasilitas' },
    { label: 'Overall', key: 'Rating_Keseluruhan' },
  ];
  return aspects
    .map((a) => ({ aspect: a.label, value: safeAvg(a.key) }))
    .filter((a) => a.value !== null);
}

// ── Insight generator ─────────────────────────────────────────────────────────
export function generateInsights(id) {
  const kpis = computeKPIs(id);
  const insights = [];

  if (kpis.hasTest) {
    if (kpis.gainPct !== null && kpis.gainPct > 10) {
      insights.push({
        type: 'success',
        title: 'Peningkatan yang Baik',
        desc: `Rata-rata peningkatan nilai peserta sebesar ${kpis.gainPct}%. Pertahankan metode penyampaian materi.`,
      });
    } else if (kpis.gainPct !== null && kpis.gainPct <= 10) {
      insights.push({
        type: 'warning',
        title: 'Peningkatan Moderat',
        desc: `Peningkatan rata-rata ${kpis.gainPct}%. Pertimbangkan metode pembelajaran yang lebih interaktif.`,
      });
    }

    if (kpis.avgPost !== null && kpis.avgPost >= 80) {
      insights.push({
        type: 'success',
        title: 'Pemahaman Peserta Tinggi',
        desc: `Rata-rata Post Test ${kpis.avgPost}/100, menunjukkan peserta memahami materi dengan baik.`,
      });
    }
  }

  if (kpis.hasFeedback) {
    if (kpis.avgKepuasan !== null && kpis.avgKepuasan >= 4.5) {
      insights.push({
        type: 'star',
        title: 'Kepuasan Tinggi',
        desc: `Peserta sangat puas dengan kegiatan ini (${kpis.avgKepuasan}/5). Pertahankan kualitas penyelenggaraan!`,
      });
    } else if (kpis.avgKepuasan !== null && kpis.avgKepuasan < 4.0) {
      insights.push({
        type: 'warning',
        title: 'Perlu Peningkatan Kepuasan',
        desc: `Rating kepuasan ${kpis.avgKepuasan}/5. Evaluasi aspek yang mendapat penilaian rendah.`,
      });
    }

    if (kpis.ratingMateri !== null && kpis.ratingPemateri !== null) {
      const lower = kpis.ratingMateri < kpis.ratingPemateri ? 'Materi' : 'Pemateri';
      const lowerVal = Math.min(kpis.ratingMateri, kpis.ratingPemateri);
      if (lowerVal < 4.5) {
        insights.push({
          type: 'tip',
          title: 'Saran Perbaikan',
          desc: `Aspek ${lower} mendapat rating ${lowerVal}/5. Beberapa peserta menyarankan penambahan studi kasus dan waktu diskusi lebih banyak.`,
        });
      }
    }
  }

  if (kpis.status === 'belum selesai') {
    insights.push({
      type: 'info',
      title: 'Kegiatan Masih Berlangsung',
      desc: `Kegiatan ini masih berjalan. Data yang ditampilkan adalah hasil sementara.`,
    });
  }

  // Default
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Data Kegiatan',
      desc: `${kpis.totalPeserta} peserta mengikuti kegiatan ini. Data tersedia untuk analisis lebih lanjut.`,
    });
  }

  return insights;
}

// ── Summary stats (all kegiatan) ──────────────────────────────────────────────
export function getSummaryStats() {
  const totalPeserta = peserta.length;
  const totalKeg = kegiatan.length;
  const selesai = kegiatan.filter((k) => k.Status === 'Selesai').length;

  const allPreVals = prepost.map((p) => p.Nilai_PreTest).filter((v) => v !== null);
  const allPostVals = prepost.map((p) => p.Nilai_PostTest).filter((v) => v !== null);
  const overallPre = round2(avg(allPreVals));
  const overallPost = round2(avg(allPostVals));

  const allOveralls = feedback.map((f) => f.Rating_Keseluruhan).filter((v) => v !== null);
  const overallRating = round2(avg(allOveralls));

  return { totalPeserta, totalKeg, selesai, overallPre, overallPost, overallRating };
}

// ── All data table ──────────────────────────────────────────────────────────
export function getAllDataTable() {
  return peserta.map((p) => {
    const kg = kegiatan.find((k) => k.ID_Kegiatan === p.ID_Kegiatan);
    const pt = prepost.find((t) => t.ID_Peserta === p.ID_Peserta);
    const fb = feedback.find((f) => f.ID_Kegiatan === p.ID_Kegiatan);
    return {
      ID_Peserta: p.ID_Peserta,
      Nama: p.Nama,
      Divisi_atau_Status: p.Divisi_atau_Status,
      Program_Studi: p.Program_Studi,
      Universitas: p.Universitas,
      Nama_Kegiatan: kg ? kg.Nama_Kegiatan : '-',
      Jenis_Kegiatan: kg ? kg.Jenis_Kegiatan : '-',
      Status: kg ? kg.Status : '-',
      Nilai_PreTest: pt ? pt.Nilai_PreTest : '-',
      Nilai_PostTest: pt ? pt.Nilai_PostTest : '-',
      Peningkatan: pt && pt.Persentase_Peningkatan !== null ? `${pt.Persentase_Peningkatan}%` : '-',
      Rating_Keseluruhan: fb ? fb.Rating_Keseluruhan : '-',
    };
  });
}
