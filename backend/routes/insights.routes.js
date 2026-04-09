import express from 'express';
import { getInsights, parseNLPFilter, getDashboardSummary } from '../controllers/insights.controller.js';

const router = express.Router();

router.post('/', getInsights);
router.post('/nlp', parseNLPFilter);
router.post('/summary', getDashboardSummary);

export default router;
