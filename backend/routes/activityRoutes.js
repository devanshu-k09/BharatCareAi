import express from 'express';
import { getActivities, logActivity, clearActivities } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getActivities);
router.post('/', protect, logActivity);
router.delete('/', protect, clearActivities);

export default router;
