import React from 'react';

const KPI = ({ title, value, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800/60 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_40px_rgb(0,0,0,0.2)] group relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-2xl group-hover:bg-brand-500/20 transition-all duration-500"></div>
      
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 relative z-10">{title}</h3>
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {prefix}{value}
        </span>
        <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
};

export default KPI;
