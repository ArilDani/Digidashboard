import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { getAllDataTable, kegiatan } from '../utils/dataUtils';

export default function DataProker({ selectedKegiatanId }) {
  const [search, setSearch] = useState('');
  const [filterKg, setFilterKg] = useState('all');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  
  const allData = useMemo(() => getAllDataTable(filterKg), [filterKg]);

  const filtered = useMemo(() => {
    let data = allData;
    if (filterKg !== 'all' && filterKg !== 'KGT006' && filterKg !== 'KGT007') {
      data = data.filter(r => r.Nama_Kegiatan === kegiatan.find(k => k.ID_Kegiatan === filterKg)?.Nama_Kegiatan);
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
    }
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        const an = parseFloat(av), bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) return sortDir === 'asc' ? an - bn : bn - an;
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return data;
  }, [allData, search, filterKg, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  // Kolom: dinamis sesuai data
  const columns = useMemo(() => {
    if (filtered.length > 0) {
      return Object.keys(filtered[0]).map(k => ({
        key: k,
        label: k.replace(/_/g, ' ')
      }));
    }
    return [
      { key: 'Nama_Kegiatan', label: 'Kegiatan' },
      { key: 'Jenis_Kegiatan', label: 'Jenis' },
      { key: 'Rating_Materi', label: 'Materi' },
      { key: 'Rating_Pemateri', label: 'Pemateri' },
      { key: 'Rating_Panitia', label: 'Panitia' },
      { key: 'Rating_Fasilitas', label: 'Fasilitas' },
      { key: 'Rating_Keseluruhan', label: 'Keseluruhan' },
      { key: 'Kritik_dan_Saran', label: 'Kritik & Saran' },
    ];
  }, [filtered]);
  return (
    <div className="flex flex-col gap-4 animate-on-load">
      <div>
        <h2 className="text-xl font-bold text-white">Data Proker</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Semua data peserta dari seluruh kegiatan</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-52"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari kegiatan, divisi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground flex-1"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Filter size={14} className="text-muted-foreground" />
          <select
            value={filterKg}
            onChange={e => setFilterKg(e.target.value)}
            className="bg-transparent outline-none text-sm text-white cursor-pointer"
          >
            <option value="all" style={{ background: '#1a2744' }}>Semua Kegiatan</option>
            {kegiatan.map(k => (
              <option key={k.ID_Kegiatan} value={k.ID_Kegiatan} style={{ background: '#1a2744' }}>
                {k.Nama_Kegiatan}
              </option>
            ))}
          </select>
        </div>
        <div className="badge-gold">
          {filtered.length} dari {allData.length} record
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sticky left-0 z-10" style={{ background: 'rgba(212,160,23,0.12)' }}>No</th>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer hover:bg-gold-400/20 transition-colors select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key
                        ? sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                        : <span className="opacity-30"><ChevronUp size={11} /></span>
                      }
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-muted-foreground py-12">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={i}>
                    <td className="sticky left-0 text-muted-foreground text-xs" style={{ background: '#111520' }}>{i + 1}</td>
                    {columns.map(col => (
                      <td key={col.key} className="whitespace-nowrap">
                        {col.key === 'Jenis_Kegiatan' ? (
                          <span className={row[col.key] === 'Proker' ? 'badge-gold' : 'badge-blue'}>
                            {row[col.key]}
                          </span>
                        ) : String(row[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
