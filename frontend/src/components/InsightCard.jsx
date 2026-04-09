import React, { useState } from 'react';
import { fetchInsights } from '../services/api';

const InsightCard = ({ vaccinesData }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    setHasGenerated(true);
    try {
      const payload = { data: vaccinesData.slice(0, 50) };
      const res = await fetchInsights(payload);
      if (res.insights && Array.isArray(res.insights)) {
        setInsights(res.insights);
      } else {
        setInsights(["Generated insights structure is unexpected."]);
      }
    } catch (error) {
      setInsights(["Unable to generate insights at this time."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-r from-brand-600 to-indigo-700 dark:from-brand-900 dark:to-indigo-950 p-[2px] rounded-[24px] mb-12 shadow-lg hover:shadow-indigo-500/20 transition-all duration-500">
      <div className="bg-white dark:bg-[#1e293b] rounded-[22px] p-6 sm:p-8 relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-500/10 blur-3xl"></div>
        
        <div className="flex items-start gap-4 flex-col sm:flex-row relative z-10 w-full">
          <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h3 className="text-sm font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-brand-500 dark:from-indigo-400 dark:to-brand-400 uppercase tracking-widest">
                AI Insight Generator
              </h3>
              <button 
                onClick={generateInsights} 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 w-full sm:w-max flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>✨ Generate Insights</>
                )}
              </button>
            </div>
            
            {!hasGenerated && !loading && (
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Click to analyze the current filtered dataset and generate 3 top-level trends via Gemini AI.</p>
            )}

            {hasGenerated && (
              loading ? (
                <div className="space-y-4 mt-6">
                  <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-full"></div>
                  <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-11/12"></div>
                  <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse w-4/5"></div>
                </div>
              ) : (
                <ul className="space-y-4 mt-6">
                  {insights.map((ins, i) => (
                    <li key={i} className="flex gap-4 items-start text-slate-700 dark:text-slate-200">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-black shadow-sm mt-0.5">{i+1}</span>
                      <span className="text-base md:text-lg font-medium leading-relaxed">{ins}</span>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
