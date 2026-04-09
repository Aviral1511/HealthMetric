import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import KPI from '../components/KPI';
import { fetchVaccines, fetchSummary } from '../services/api';

const Dashboard = () => {
  const [filters, setFilters] = useState({ region: '', brand: '', year: '' });
  const [vaccinesData, setVaccinesData] = useState([]);
  const [summaryData, setSummaryData] = useState({ marketSize: 0, avgPrice: 0, cagr: 0 });
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className={`flex min-h-screen font-sans ${isDark ? 'dark bg-slate-950' : 'bg-slate-50/50'}`}>
      <Sidebar filters={filters} setFilters={setFilters} isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto w-full relative">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Market Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Gain insights into global vaccine distribution safely.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Data Mode API
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10 w-full">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-12">
            <KPI title="Total Market Size" value={summaryData.marketSize.toFixed(2)} prefix="$" suffix="B" />
            <KPI title="Average Price" value={summaryData.avgPrice.toFixed(2)} prefix="$" />
            <KPI title="Avg Growth Rate (CAGR)" value={summaryData.cagr.toFixed(2)} suffix="%" />
          </div>
        )}

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800/60 p-10 flex items-center justify-center min-h-[500px] relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-indigo-500/5 dark:from-brand-500/10 dark:to-indigo-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
           <div className="text-center relative z-10 transform transition-transform duration-500 group-hover:scale-105">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-200 dark:border-slate-700">
               <svg className="w-10 h-10 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Charts Ready For Implementation</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-sm">
               Data fetching and filtering is fully active. Proceed to Step 7 to render visual data.
             </p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
