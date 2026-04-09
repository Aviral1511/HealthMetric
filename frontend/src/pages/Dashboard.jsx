import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import KPI from '../components/KPI';
import { fetchVaccines, fetchSummary } from '../services/api';

import DashboardCharts from '../components/Charts/DashboardCharts';

const Dashboard = () => {
  const [filters, setFilters] = useState({ region: '', brand: '', year: '' });
  const [vaccinesData, setVaccinesData] = useState([]);
  const [summaryData, setSummaryData] = useState({ marketSize: 0, avgPrice: 0, cagr: 0 });
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
        );
        
        const summary = await fetchSummary(activeFilters);
        setSummaryData(summary);
        
        const vaccines = await fetchVaccines(activeFilters);
        setVaccinesData(vaccines);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [filters]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`flex min-h-screen font-sans ${isDark ? 'dark bg-[#0f172a]' : 'bg-[#f4f7f9]'}`}>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">V</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">VaxInsight</h1>
         </div>
         <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
           </svg>
         </button>
      </div>

      {/* Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar filters={filters} setFilters={setFilters} isDark={isDark} toggleTheme={toggleTheme} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full max-w-full mt-16 md:mt-0 transition-colors duration-300">
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Market Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg">Gain insights into global vaccine distribution safely.</p>
          </div>
          <div className="inline-flex w-max items-center gap-2 text-xs md:text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Data Mode API
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10 w-full hover:shadow-none">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-12">
            <KPI title="Total Market Size" value={summaryData.marketSize.toFixed(2)} prefix="$" suffix="B" />
            <KPI title="Average Price" value={summaryData.avgPrice.toFixed(2)} prefix="$" />
            <KPI title="Avg Growth Rate (CAGR)" value={summaryData.cagr.toFixed(2)} suffix="%" />
          </div>
        )}

        <DashboardCharts data={vaccinesData} />
      </main>
    </div>
  );
};

export default Dashboard;
