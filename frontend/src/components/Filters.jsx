import React, { useState } from 'react';
import { fetchNLPFilter } from '../services/api';

const Filters = ({ filters, setFilters }) => {
  const [nlpQuery, setNlpQuery] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNLP = async (e) => {
    e.preventDefault();
    if (!nlpQuery.trim()) return;
    setNlpLoading(true);
    try {
      const aiFilters = await fetchNLPFilter(nlpQuery);
      setFilters(prev => ({ ...prev, ...aiFilters }));
      setNlpQuery("");
    } catch (err) {
      console.error(err);
    } finally {
      setNlpLoading(false);
    }
  };

  const selectClasses = "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 block px-4 py-3 transition-all duration-200 shadow-sm outline-none appearance-none hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer";

  return (
    <div className="flex flex-col gap-6">
      <div className="filter-group relative">
        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Region</label>
        <div className="relative">
          <select name="region" value={filters.region || ""} onChange={handleChange} className={selectClasses}>
            <option value="">🌎 All Regions</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Africa">Africa</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="filter-group relative">
        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Brand</label>
        <div className="relative">
          <select name="brand" value={filters.brand || ""} onChange={handleChange} className={selectClasses}>
            <option value="">💉 All Brands</option>
            <option value="Pfizer">Pfizer</option>
            <option value="Moderna">Moderna</option>
            <option value="AstraZeneca">AstraZeneca</option>
            <option value="Sinovac">Sinovac</option>
            <option value="J&J">J&J</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="filter-group relative">
        <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Year</label>
        <div className="relative">
          <select name="year" value={filters.year || ""} onChange={handleChange} className={selectClasses}>
            <option value="">📅 All Years</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleNLP} className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
          ✨ Filter with AI
        </label>
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={nlpQuery}
            onChange={(e) => setNlpQuery(e.target.value)}
            placeholder="e.g. only show pfizer in asia" 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-all"
            disabled={nlpLoading}
          />
          <button 
            type="submit" 
            disabled={nlpLoading || !nlpQuery.trim()}
            className="absolute right-1.5 h-7 w-7 bg-indigo-500 text-white rounded-lg flex justify-center items-center font-bold disabled:opacity-50 hover:bg-indigo-600 transition-colors"
          >
            {nlpLoading ? (
               <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            )}
          </button>
        </div>
      </form>
      
      <button 
        onClick={() => setFilters({ region: '', brand: '', year: '' })}
        className="mt-1 py-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-bold tracking-wide text-left transition-colors flex items-center gap-2 group w-max"
      >
        <svg className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
