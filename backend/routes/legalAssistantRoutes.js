import express from 'express';
import { legalAssistant } from '../controllers/legalAssistantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, legalAssistant);

export default router;
