import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchVaccines = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE_URL}/api/vaccines?${params}`);
  return res.data;
};

export const fetchSummary = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE_URL}/api/summary?${params}`);
  return res.data;
};

export const fetchInsights = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/insights`, payload);
  return res.data;
};

export const fetchNLPFilter = async (query) => {
  const res = await axios.post(`${API_BASE_URL}/api/insights/nlp`, { query });
  return res.data;
};

export const fetchAISummary = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/insights/summary`, payload);
  return res.data;
};

export const askDataChatbot = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/insights/ask`, payload);
  return res.data;
};

export const fetchChartRecommendation = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/insights/chart-recommendation`, payload);
  return res.data;
};

export const fetchKpiExplanation = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/insights/kpi-explanation`, payload);
  return res.data;
};
