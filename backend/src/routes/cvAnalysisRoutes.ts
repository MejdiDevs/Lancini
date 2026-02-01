import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { analyzeCV } from '../controllers/cvAnalysisController';

const router = express.Router();

router.post('/analyze', protect, analyzeCV);

export default router;
