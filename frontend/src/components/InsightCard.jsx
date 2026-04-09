import React, { useState, useEffect } from 'react';
import { fetchInsights } from '../services/api';

const InsightCard = ({ summaryData, filters }) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getInsight = async () => {
      setLoading(true);
      try {
        const payload = { ...summaryData, ...filters };
        const data = await fetchInsights(payload);
        if (isMounted) setInsight(data.insight);
      } catch (error) {
        if (isMounted) setInsight("Unable to generate insights at this time.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (summaryData && summaryData.marketSize > 0) {
      getInsight();
    }
    return () => { isMounted = false };
  }, [summaryData, filters]);

  return (
    <div className="bg-linear-to-r from-brand-600 to-indigo-700 dark:from-brand-900 dark:to-indigo-950 p-[2px] rounded-[24px] mb-12 shadow-lg hover:shadow-indigo-500/20 transition-all duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 sm:p-8 relative overflow-hidden h-full">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-500/10 blur-3xl"></div>
        
        <div className="flex items-start gap-4 flex-col sm:flex-row">
          <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-brand-500 dark:from-indigo-400 dark:to-brand-400 uppercase tracking-widest mb-2">
              Gemini AI Insight
            </h3>
            {loading ? (
              <div className="space-y-3 mt-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <p className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-200 leading-snug">
                "{insight}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
