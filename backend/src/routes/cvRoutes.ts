import express from 'express';
import { getMyCV, updateCV, exportCV } from '../controllers/cvController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getMyCV);
router.put('/', protect, updateCV);
router.post('/export', protect, exportCV);

export default router;
