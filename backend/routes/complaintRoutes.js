import express from 'express';
import { generateComplaintDraft, getUserComplaints } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateComplaintDraft);
router.get('/history', protect, getUserComplaints);

export default router;
