import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { upload, uploadLocal } from '../config/multer';
import { uploadProfileImage, uploadBanner, uploadCV, uploadProjectImage } from '../controllers/uploadController';

const router = express.Router();

router.use(protect);

router.post('/profile-image', upload.single('image'), uploadProfileImage);
router.post('/logo', upload.single('image'), uploadProfileImage);
router.post('/image', upload.single('image'), uploadProfileImage);
router.post('/banner', upload.single('image'), uploadBanner);
router.post('/cv', uploadLocal.single('file'), uploadCV);
router.post('/project-image', upload.single('image'), uploadProjectImage);

export default router;
