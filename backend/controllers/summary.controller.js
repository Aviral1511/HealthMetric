import fs from 'fs';
import { applyFilters } from '../utils/filters.js';

const vaccinesData = JSON.parse(fs.readFileSync(new URL('../data/vaccines.json', import.meta.url)));

export const getSummary = (req, res) => {
  try {
    const filters = {
      region: req.query.region,
      brand: req.query.brand,
      year: req.query.year
    };
    
    const data = applyFilters(vaccinesData, filters);
    
    if (data.length === 0) {
      return res.status(200).json({ marketSize: 0, avgPrice: 0, cagr: 0 });
    }

    let totalMarketSize = 0;
    let totalPrice = 0;
    let totalGrowthRate = 0;

    data.forEach(item => {
      totalMarketSize += item.market_size;
      totalPrice += item.price;
      totalGrowthRate += item.growth_rate;
    });

    const count = data.length;
    
    const avgPrice = totalPrice / count;
    const avgCagr = (totalGrowthRate / count) * 100;

    res.status(200).json({
      marketSize: parseFloat(totalMarketSize.toFixed(2)),
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      cagr: parseFloat(avgCagr.toFixed(2))
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: 'Server error retrieving summary metrics' });
  }
};
