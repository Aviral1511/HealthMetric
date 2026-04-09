import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchVaccines = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE_URL}/vaccines?${params}`);
  return res.data;
};

export const fetchSummary = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE_URL}/summary?${params}`);
  return res.data;
};

export const fetchInsights = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/insights`, payload);
  return res.data;
};
