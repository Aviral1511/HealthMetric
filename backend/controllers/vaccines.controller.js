import fs from 'fs';
import { applyFilters } from '../utils/filters.js';

const vaccinesData = JSON.parse(fs.readFileSync(new URL('../data/vaccines.json', import.meta.url)));

export const getVaccines = (req, res) => {
  try {
    const filters = {
      region: req.query.region,
      brand: req.query.brand,
      year: req.query.year
    };
    
    let data = applyFilters(vaccinesData, filters);
    
    const { sort, order, page, limit } = req.query;
    
    if (sort) {
      data = data.sort((a, b) => {
        if (a[sort] < b[sort]) return order === 'desc' ? 1 : -1;
        if (a[sort] > b[sort]) return order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    if (page && limit) {
      const p = parseInt(page, 10) || 1;
      const l = parseInt(limit, 10) || 10;
      const startIndex = (p - 1) * l;
      const endIndex = p * l;
      const paginatedData = data.slice(startIndex, endIndex);
      
      return res.status(200).json({
        data: paginatedData,
        total: data.length,
        page: p,
        limit: l,
        totalPages: Math.ceil(data.length / l)
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    res.status(500).json({ error: 'Server error retrieving vaccines data' });
  }
};
