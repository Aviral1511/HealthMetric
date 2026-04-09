import React, { useState, useEffect } from 'react';
import { fetchChartRecommendation } from '../../services/api.js';

const ChartRecommendation = ({ filters }) => {
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getRecommendation = async () => {
      setLoading(true);
      try {
        const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""));
        const res = await fetchChartRecommendation(activeFilters);
        if (isMounted) setRecommendation(res.recommendation);
      } catch (err) {
        if (isMounted) setRecommendation("Explore all charts below for multi-angle insights.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    getRecommendation();
    return () => { isMounted = false; };
  }, [filters]);

  return (
    <div className="mb-6 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 px-4 py-3 rounded-xl">
      <div className="flex items-center gap-3 w-full">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
          {loading ? (
            <div className="h-4 bg-emerald-200/50 dark:bg-emerald-800/30 rounded animate-pulse w-3/4"></div>
          ) : (
            <>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 mr-2">Smart Suggestion:</span>
              {recommendation}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartRecommendation;
