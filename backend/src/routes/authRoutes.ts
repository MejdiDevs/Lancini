import express from 'express';
import { registerStudent, registerEnterprise, loginUser, logoutUser, getMe, updatePassword } from '../controllers/authController';
import { verifyEmail, resendVerificationEmail } from '../controllers/verificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register/student', registerStudent);
router.post('/register/enterprise', registerEnterprise);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router;
