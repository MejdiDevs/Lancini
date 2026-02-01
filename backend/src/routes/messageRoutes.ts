import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getConversations, getConversationMessages, getMyMessages, sendMessage, markAsRead } from '../controllers/messageController';

const router = express.Router();

router.use(protect); // All routes protected

router.get('/conversations', getConversations); // Get all conversations
router.get('/conversation/:partnerId', getConversationMessages); // Get messages with specific user
router.get('/', getMyMessages); // Legacy - all messages
router.post('/', sendMessage);
router.put('/:id/read', markAsRead);

export default router;
