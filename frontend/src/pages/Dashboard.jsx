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

        <DashboardCharts data={vaccinesData} />
      </main>
    </div>
  );
};

export default Dashboard;
