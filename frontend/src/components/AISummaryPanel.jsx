import React, { useState, useEffect } from 'react';
import { fetchAISummary } from '../services/api';

const AISummaryPanel = ({ summaryData, filters }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getSummary = async () => {
      setLoading(true);
      try {
        const payload = { ...summaryData, ...filters };
        const data = await fetchAISummary(payload);
        if (isMounted) setSummary(data.summary);
      } catch (error) {
        if (isMounted) setSummary("Unable to generate summary at this time.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (summaryData?.marketSize > 0) getSummary();
    return () => { isMounted = false };
  }, [summaryData, filters]);

  return (
    <div className="mt-8 mb-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-4 md:gap-5 shadow-sm">
      <div className="shrink-0 w-12 h-12 rounded-full bg-white dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-500/20 shadow-sm flex items-center justify-center">
         <span className="text-xl">📊</span>
      </div>
      <div className="flex-1 w-full">
        <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-3">Dashboard AI Summary</h3>
        {loading ? (
          <div className="space-y-3 mt-2 w-full">
            <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/30 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/30 rounded animate-pulse w-11/12"></div>
            <div className="h-4 bg-indigo-200/50 dark:bg-indigo-800/30 rounded animate-pulse w-4/5"></div>
          </div>
        ) : (
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
             {summary}
          </p>
        )}
      </div>
    </div>
  );
};

export default AISummaryPanel;
