import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getMyProfile,
    updateProfile,
    getMyProjects,
    createProject,
    updateProject,
    deleteProject,
    getProfileByUsername,
    getProjectsByUserId,
    getAllStudents
} from '../controllers/profileController';

const router = express.Router();

// Public routes (no auth required)
router.get('/public/:username', getProfileByUsername);
router.get('/public/projects/:userId', getProjectsByUserId);

// Protected routes
router.use(protect);

router.get('/me', getMyProfile);
router.get('/all-students', getAllStudents);
router.put('/me', updateProfile);

router.get('/projects', getMyProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;
