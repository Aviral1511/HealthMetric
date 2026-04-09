export const applyFilters = (data, filters) => {
  let filtered = [...data];
  
  if (filters.region) {
    filtered = filtered.filter(item => item.region.toLowerCase() === filters.region.toLowerCase());
  }
  
  if (filters.brand) {
    filtered = filtered.filter(item => item.vaccine_brand.toLowerCase() === filters.brand.toLowerCase());
  }
  
  if (filters.year) {
    filtered = filtered.filter(item => item.year === parseInt(filters.year, 10));
  }
  
  return filtered;
};
