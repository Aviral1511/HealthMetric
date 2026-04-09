import React from 'react';
import Filters from './Filters';

const Sidebar = ({ filters, setFilters, isDark, toggleTheme, isOpen, setIsOpen }) => {
  return (
    <aside className={`
      fixed md:sticky top-0 left-0 h-[100dvh] w-72 flex flex-col p-6 
      bg-white dark:bg-[#111827] border-r border-[#e2e8f0] dark:border-slate-800 
      transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/30 flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-300 tracking-tight">
            VaxInsight
          </h2>
        </div>
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 mb-4 tracking-wider">Dashboard Filters</h3>
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
         <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
           {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
         </span>
         <button
            type="button"
            className={`${
              isDark ? 'bg-brand-500' : 'bg-slate-300'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 group`}
            role="switch"
            aria-checked={isDark}
            onClick={toggleTheme}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              aria-hidden="true"
              className={`${
                isDark ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-hover:shadow-md`}
            />
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
