import express from 'express';
import {
  getTopics,
  getTrendingTopics,
  getUserBookmarks,
  getTopicById,
  incrementViewCount,
  toggleBookmark,
  createTopic,
  updateTopic,
  deleteTopic
} from '../controllers/topicController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTopics);
router.get('/trending', getTrendingTopics);
router.get('/bookmarks', protect, getUserBookmarks);
router.get('/:id', getTopicById);
router.post('/:id/view', incrementViewCount);
router.post('/:id/bookmark', protect, toggleBookmark);

// Admin / Management endpoints
router.post('/', protect, createTopic);
router.put('/:id', protect, updateTopic);
router.delete('/:id', protect, deleteTopic);

export default router;
