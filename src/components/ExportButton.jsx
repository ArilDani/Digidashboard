import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ExportButton({ selectedKegiatan, kpis, tableData }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExcelExport = async () => {
    setExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = [
        ['DigiDashboard - Laporan Kegiatan'],
        [''],
        ['Nama Kegiatan', selectedKegiatan?.Nama_Kegiatan || '-'],
        ['Jenis Kegiatan', selectedKegiatan?.Jenis_Kegiatan || '-'],
        ['Penyelenggara', selectedKegiatan?.Penyelenggara || '-'],
        ['Target Peserta', selectedKegiatan?.Target_Peserta || '-'],
        ['Status', selectedKegiatan?.Status || '-'],
        [''],
        ['KPI', 'Nilai'],
        ['Total Peserta', kpis.totalPeserta],
        ['Rata-rata Pre Test', kpis.avgPre ?? 'N/A'],
        ['Rata-rata Post Test', kpis.avgPost ?? 'N/A'],
        ['Peningkatan (Gain)', kpis.gain ?? 'N/A'],
        ['Peningkatan (%)', kpis.gainPct ? `${kpis.gainPct}%` : 'N/A'],
        ['Kepuasan Peserta', kpis.avgKepuasan ? `${kpis.avgKepuasan}/5` : 'N/A'],
      ];
      const ws = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws, 'Summary');

      // Data sheet
      if (tableData && tableData.length > 0) {
        const ws2 = XLSX.utils.json_to_sheet(tableData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Data Peserta');
      }

      XLSX.writeFile(wb, `DigiDashboard_${selectedKegiatan?.Nama_Kegiatan || 'Laporan'}_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`);
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
    setOpen(false);
  };

  const handlePDFExport = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Header
      doc.setFillColor(26, 31, 46);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setTextColor(212, 160, 23);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('DigiDashboard', 20, 25);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(`Laporan: ${selectedKegiatan?.Nama_Kegiatan || '-'}`, 20, 35);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text(`Digenerate: ${new Date().toLocaleDateString('id-ID')} | HIMA BISDIG FEB UNM`, 20, 43);

      // KPI table
      const kpiRows = [
        ['Total Peserta', String(kpis.totalPeserta)],
        ['Rata-rata Pre Test', kpis.avgPre !== null ? String(kpis.avgPre) : 'N/A'],
        ['Rata-rata Post Test', kpis.avgPost !== null ? String(kpis.avgPost) : 'N/A'],
        ['Peningkatan (Gain)', kpis.gain !== null ? `${kpis.gain} poin` : 'N/A'],
        ['Peningkatan (%)', kpis.gainPct !== null ? `${kpis.gainPct}%` : 'N/A'],
        ['Kepuasan Peserta', kpis.avgKepuasan !== null ? `${kpis.avgKepuasan}/5 — ${kpis.kepuasanKategori}` : 'N/A'],
      ];

      autoTable(doc, {
        startY: 52,
        head: [['Indikator', 'Nilai']],
        body: kpiRows,
        theme: 'grid',
        headStyles: { fillColor: [212, 160, 23], textColor: [26, 31, 46], fontStyle: 'bold', fontSize: 10 },
        bodyStyles: { fillColor: [30, 42, 61], textColor: [255, 255, 255], fontSize: 9 },
        alternateRowStyles: { fillColor: [22, 32, 53] },
        styles: { lineColor: [255, 255, 255, 20] },
      });

      // Data table
      if (tableData && tableData.length > 0) {
        const headers = Object.keys(tableData[0]);
        const rows = tableData.map((r) => headers.map((h) => String(r[h] ?? '-')));
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [headers],
          body: rows,
          theme: 'grid',
          headStyles: { fillColor: [26, 40, 80], textColor: [212, 160, 23], fontStyle: 'bold', fontSize: 7 },
          bodyStyles: { fillColor: [26, 31, 46], textColor: [200, 210, 230], fontSize: 7 },
          alternateRowStyles: { fillColor: [30, 42, 61] },
        });
      }

      // Footer
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text('© Himpunan Mahasiswa Bisnis Digital FEB UNM', 105, 290, { align: 'center' });

      doc.save(`DigiDashboard_${selectedKegiatan?.Nama_Kegiatan || 'Laporan'}_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
    }
    setExporting(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-glow"
        style={{
          background: 'linear-gradient(135deg, #a16207 0%, #d4a017 100%)',
          color: '#1a1f2e',
        }}
      >
        <Download size={15} />
        <span>Export Laporan</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute bottom-full mb-2 left-0 z-50 rounded-xl overflow-hidden shadow-card"
            style={{ background: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', minWidth: 200 }}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <span className="text-xs font-semibold text-white">Pilih Format</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-white">
                <X size={14} />
              </button>
            </div>
            <button
              onClick={handleExcelExport}
              disabled={exporting}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
            >
              <FileSpreadsheet size={16} className="text-emerald-400" />
              <div className="text-left">
                <div className="font-medium">Excel (.xlsx)</div>
                <div className="text-xs text-muted-foreground">KPI + Data Peserta</div>
              </div>
            </button>
            <button
              onClick={handlePDFExport}
              disabled={exporting}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
            >
              <FileText size={16} className="text-red-400" />
              <div className="text-left">
                <div className="font-medium">PDF</div>
                <div className="text-xs text-muted-foreground">Laporan lengkap</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
