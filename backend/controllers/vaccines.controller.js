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
    
    const data = applyFilters(vaccinesData, filters);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    res.status(500).json({ error: 'Server error retrieving vaccines data' });
  }
};
