import React, { useState, useEffect } from 'react';
import { fetchVaccines } from '../services/api';

const DataTable = ({ filters }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState('market_size');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  const loadPageData = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const res = await fetchVaccines({ ...activeFilters, page, limit, sort, order });
      if (res && res.data) {
        setData(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(1) }, [filters]);

  useEffect(() => {
    loadPageData();
  }, [filters, page, limit, sort, order]);

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else {
      setSort(field);
      setOrder('desc');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const thClass = "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none";

  return (
    <div className="mt-12 bg-white dark:bg-[#1e293b] rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-[#e2e8f0] dark:border-slate-800 overflow-hidden group">
      <div className="p-6 border-b border-[#e2e8f0] dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#1e293b]">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Vaccine Distribution Registry
        </h3>
        <select
          value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
          className="bg-white dark:bg-slate-900 border dark:text-gray-100 text-gray-800 border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value={5}>5 Rows</option>
          <option value={10}>10 Rows</option>
          <option value={20}>20 Rows</option>
        </select>
      </div>

      <div className="overflow-x-auto min-h-[300px] relative">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/50">
            <tr>
              <th className={thClass} onClick={() => handleSort('vaccine_brand')}>Brand {sort === 'vaccine_brand' && (order === 'desc' ? '↓' : '↑')}</th>
              <th className={thClass} onClick={() => handleSort('region')}>Region {sort === 'region' && (order === 'desc' ? '↓' : '↑')}</th>
              <th className={thClass} onClick={() => handleSort('year')}>Year {sort === 'year' && (order === 'desc' ? '↓' : '↑')}</th>
              <th className={thClass} onClick={() => handleSort('market_size')}>Market Size {sort === 'market_size' && (order === 'desc' ? '↓' : '↑')}</th>
              <th className={thClass} onClick={() => handleSort('price')}>Price {sort === 'price' && (order === 'desc' ? '↓' : '↑')}</th>
              <th className={thClass} onClick={() => handleSort('growth_rate')}>CAGR {sort === 'growth_rate' && (order === 'desc' ? '↓' : '↑')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-slate-800/60 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8">
                  <div className="flex justify-center flex-col gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded w-full animate-pulse"></div>)}
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">No records found.</td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{row.vaccine_brand}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.region} ({row.country})</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.year}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">${row.market_size.toFixed(2)}B</td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">${row.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 flex items-center w-max gap-1 rounded-full text-xs font-bold ${row.growth_rate > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                      {row.growth_rate > 0 ? '+' : ''}{(row.growth_rate * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50 dark:bg-[#1e293b]">
        <span className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{data.length > 0 ? ((page - 1) * limit) + 1 : 0}</span> to <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
