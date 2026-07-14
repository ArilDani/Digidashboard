import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import Dashboard from './pages/Dashboard';
import DataProker from './pages/DataProker';
import SummaryData from './pages/SummaryData';
import { getKegiatanById } from './utils/dataUtils';
import './index.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedKegiatanId, setSelectedKegiatanId] = useState('KGT002'); // Finance Talk x Pintu as default (matches design)

  const selectedKegiatan = getKegiatanById(selectedKegiatanId);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard selectedKegiatanId={selectedKegiatanId} />;
      case 'dataproker':
        return <DataProker selectedKegiatanId={selectedKegiatanId} />;
      case 'summary':
        return <SummaryData />;
      default:
        return <Dashboard selectedKegiatanId={selectedKegiatanId} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0d1018' }}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        selectedKegiatanId={selectedKegiatanId}
        onKegiatanChange={(id) => {
          setSelectedKegiatanId(id);
          setActivePage('dashboard'); // jump to dashboard on kegiatan change
        }}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header selectedKegiatan={selectedKegiatan} />
        <main className="flex-1 overflow-y-auto p-5">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
