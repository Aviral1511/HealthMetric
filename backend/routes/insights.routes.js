import express from 'express';
import { getInsights, parseNLPFilter, getDashboardSummary, askDataChatbot, getChartRecommendation, getKpiExplanation } from '../controllers/insights.controller.js';

const router = express.Router();

router.post('/', getInsights);
router.post('/nlp', parseNLPFilter);
router.post('/summary', getDashboardSummary);
router.post('/ask', askDataChatbot);
router.post('/chart-recommendation', getChartRecommendation);
router.post('/kpi-explanation', getKpiExplanation);

export default router;
