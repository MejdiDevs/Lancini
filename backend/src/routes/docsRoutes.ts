import express from 'express';
import { getApiDocs } from '../controllers/docsController';

const router = express.Router();

router.get('/', getApiDocs);

export default router;
