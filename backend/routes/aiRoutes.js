import express from 'express';
import { generateLegalAdvice, getUserChats, deleteChat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, generateLegalAdvice);
router.get('/chats', protect, getUserChats);
router.delete('/chat/:id', protect, deleteChat);

export default router;
