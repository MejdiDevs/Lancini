import express from 'express';
import { getAllEditions, getEditionByYear, seedEditions } from '../controllers/editionsController';

const router = express.Router();

router.get('/', getAllEditions);
router.get('/:year', getEditionByYear);
router.post('/seed', seedEditions); // Demo data seeder

export default router;
