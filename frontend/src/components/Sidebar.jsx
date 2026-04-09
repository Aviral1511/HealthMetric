import React from 'react';
import Filters from './Filters';

const Sidebar = ({ filters, setFilters, isDark, toggleTheme }) => {
  return (
    <aside className="w-72 h-screen flex flex-col p-6 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-colors shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10">
      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/30 flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">
            VaxInsight
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-4 tracking-wider">Dashboard Filters</h3>
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
        <button 
          onClick={toggleTheme} 
          className="w-full py-3 px-4 rounded-xl relative overflow-hidden group bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-3"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
