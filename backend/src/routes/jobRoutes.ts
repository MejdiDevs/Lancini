import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getAllJobs,
    getJobById,
    createJob,
    getSavedJobs,
    toggleSaveJob,
    applyToJob,
    getAppliedJobs,
    getEnterpriseJobs,
    updateJob,
    deleteJob,
    getJobsByEnterprise,
    getJobApplications,
    updateApplicationStatus
} from '../controllers/jobController';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/enterprise/:enterpriseId', getJobsByEnterprise);
router.get('/my-listings', protect, getEnterpriseJobs);
router.get('/saved/list', protect, getSavedJobs);
router.get('/applied/list', protect, getAppliedJobs);
router.post('/:id/apply', protect, applyToJob);
router.post('/:id/save', protect, toggleSaveJob);
router.get('/:id/applications', protect, getJobApplications);
router.patch('/:id/applications/:applicationId', protect, updateApplicationStatus);
router.get('/:id', getJobById);
router.post('/', protect, createJob);
router.patch('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
