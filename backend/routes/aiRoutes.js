import express from 'express';
import { generateLegalAdvice, getUserChats, deleteChat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

// Use memory storage for chat images to directly feed them to the Gemini SDK without writing to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB file size
});

const router = express.Router();

router.post('/chat', protect, upload.single('image'), generateLegalAdvice);
router.get('/chats', protect, getUserChats);
router.delete('/chat/:id', protect, deleteChat);

export default router;
