import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { startInterview, submitAnswer, getSession } from '../controllers/interviewController';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/answer', protect, submitAnswer);
router.get('/:id', protect, getSession);

export default router;
