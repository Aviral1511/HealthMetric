import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, 
  PieChart, Pie, Cell,
  AreaChart, Area,
  ScatterChart, Scatter
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-slate-100 p-3 rounded-xl shadow-xl border border-slate-700 text-sm z-50">
        <p className="font-semibold mb-1 text-slate-300">{label || payload[0]?.payload?.name || "Data Indicator"}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex justify-between gap-6" style={{ color: entry.color }}>
            <span>{entry.name || entry.dataKey}:</span>
            <span className="font-bold">
              {typeof entry.value === 'number' && entry.value % 1 !== 0 
                ? entry.value.toFixed(2) 
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ data }) => {
  const { lineData, barData, pieData, areaData, scatterData } = useMemo(() => {
    // 1 & 4. Line Data & Area Data
    const byYearMap = (data || []).reduce((acc, curr) => {
      if (!acc[curr.year]) acc[curr.year] = { year: curr.year.toString(), market_size: 0, growth_sum: 0, count: 0 };
      acc[curr.year].market_size += curr.market_size;
      acc[curr.year].growth_sum += curr.growth_rate;
      acc[curr.year].count += 1;
      return acc;
    }, {});
    
    const byYear = Object.values(byYearMap)
      .sort((a,b) => a.year.localeCompare(b.year))
      .map(d => ({
        ...d,
        avg_growth_rate: (d.growth_sum / d.count) * 100
      }));

    // 2. Bar Data
    const byRegionMap = (data || []).reduce((acc, curr) => {
      if (!acc[curr.region]) acc[curr.region] = { region: curr.region, sales: 0 };
      acc[curr.region].sales += curr.market_size;
      return acc;
    }, {});
    const byRegion = Object.values(byRegionMap).sort((a,b) => b.sales - a.sales);

    // 3. Pie Data
    const byBrandMap = (data || []).reduce((acc, curr) => {
      if (!acc[curr.vaccine_brand]) acc[curr.vaccine_brand] = { name: curr.vaccine_brand, value: 0 };
      acc[curr.vaccine_brand].value += curr.market_size;
      return acc;
    }, {});
    const byBrand = Object.values(byBrandMap).sort((a,b) => b.value - a.value);

    // 5. Scatter Data
    const scatter = (data || []).map(d => ({
      x: d.price,
      y: d.doses_sold / 1000000, // Millions
      name: d.vaccine_brand
    }));

    return { lineData: byYear, barData: byRegion, pieData: byBrand, areaData: byYear, scatterData: scatter };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 w-full xl:col-span-2">
        <svg className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="font-medium">No results found for the selected filters.</span>
      </div>
    );
  }


  const axisStyle = { fontSize: 12, fill: '#8b9bb4', fontFamily: 'inherit' };
  const gridStyle = { stroke: '#334155', opacity: 0.15 };
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
      
      {/* Chart 1: Line Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/80 transition-all hover:shadow-md group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50"></span> 
            Market Growth vs Year
          </h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} {...gridStyle} />
              <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}B`} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} iconType="circle" />
              <Line type="monotone" dataKey="market_size" name="Market Size ($B)" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, strokeWidth: 3 }} activeDot={{ r: 8, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/80 transition-all hover:shadow-md group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span> 
            Region vs Sales
          </h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} {...gridStyle} />
              <XAxis dataKey="region" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}B`} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.05}} />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} iconType="circle" />
              <Bar dataKey="sales" name="Sales ($B)" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Pie Chart */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-[#e2e8f0] dark:border-slate-800/80 transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></span> 
            Brand Share
          </h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
              <Pie
                data={pieData}
                cx="40%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Area Chart */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-[#e2e8f0] dark:border-slate-800/80 transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"></span> 
            Growth Trend
          </h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} {...gridStyle} />
              <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} iconType="circle" />
              <Area type="monotone" dataKey="avg_growth_rate" name="Average Growth (%)" stroke="#ef4444" strokeWidth={3} fill="url(#colorGrowth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 5: Scatter Plot */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-[#e2e8f0] dark:border-slate-800/80 transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] group xl:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"></span> 
            Price vs Demand
          </h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">Pricing Strategy</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis type="number" dataKey="x" name="Price" unit="$" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="y" name="Demand" unit="M" tick={axisStyle} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} iconType="circle" />
              <Scatter name="Vaccine Distribution Profile" data={scatterData} fill="#06b6d4" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;
