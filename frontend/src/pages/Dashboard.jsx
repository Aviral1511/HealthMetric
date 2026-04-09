import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import KPI from '../components/KPI';
import InsightCard from '../components/InsightCard';
import DataTable from '../components/DataTable';
import AISummaryPanel from '../components/AISummaryPanel';
import DashboardCharts from '../components/Charts/DashboardCharts';
import { fetchVaccines, fetchSummary } from '../services/api';

const Dashboard = () => {
  const [filters, setFilters] = useState({ region: '', brand: '', year: '' });
  const [vaccinesData, setVaccinesData] = useState([]);
  const [summaryData, setSummaryData] = useState({ marketSize: 0, avgPrice: 0, cagr: 0 });
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
        );
        
        const summary = await fetchSummary(activeFilters);
        const vaccines = await fetchVaccines(activeFilters);
        
        if (isMounted) {
          setSummaryData(summary);
          setVaccinesData(vaccines);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading dashboard data:", err);
          setError("Failed to fetch data from the server. Check your connection.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false };
  }, [filters]);

  const toggleTheme = () => setIsDark(!isDark);

  const exportCSV = () => {
    if (!vaccinesData || vaccinesData.length === 0) return;
    const headers = Object.keys(vaccinesData[0]).join(",");
    const rows = vaccinesData.map(obj => Object.values(obj).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vax_insight_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex min-h-screen font-sans ${isDark ? 'dark bg-[#0f172a]' : 'bg-[#f4f7f9]'}`}>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">V</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">VaxInsight</h1>
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
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Market Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg">Gain insights into global vaccine distribution safely.</p>
          </div>
          <div className="flex flex-row items-center gap-3">
            <button 
              onClick={exportCSV}
              className="inline-flex w-max items-center gap-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
            <div className="inline-flex w-max items-center gap-2 text-xs md:text-sm font-semibold text-slate-500 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              Live Data
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-10 p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-4 shadow-sm">
            <svg className="w-6 h-6 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {/* Gemini AI Insight Card */}
        {!error && !isLoading && <InsightCard summaryData={summaryData} filters={filters} />}

        {isLoading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-10 w-full">
            {[1,2,3].map(i => (
              <div key={i} className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse"></div>
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
        
        {/* Gemini Generated Dashboard Text Summary */}
        {!error && !isLoading && <AISummaryPanel summaryData={summaryData} filters={filters} />}

        {/* Paginated Data Table underneath Charts */}
        <DataTable filters={filters} />
      </main>
    </div>
  );
};

export default Dashboard;
