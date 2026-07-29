import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

// GET /api/activity
// Fetch the authenticated user's timeline (sorted newest first).
export const getActivities = async (req, res, next) => {
  try {
    const data = db.data;
    if (!data.activities) {
      data.activities = [];
    }

    const userActivities = data.activities
      .filter(a => a.userId === req.user._id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(userActivities);
  } catch (error) {
    next(error);
  }
};

// POST /api/activity
// Allow the frontend and backend to manually record a new activity log.
export const logActivity = async (req, res, next) => {
  try {
    const { title, description, icon, type, metadata } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const data = db.data;
    if (!data.activities) {
      data.activities = [];
    }

    const newActivity = {
      _id: uuidv4(),
      userId: req.user._id,
      title,
      description,
      icon: icon || 'info',
      type: type || 'general',
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };

    data.activities.push(newActivity);
    db.write(data);

    res.status(201).json(newActivity);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/activity
// Clear all activities for the currently authenticated user.
export const clearActivities = async (req, res, next) => {
  try {
    const data = db.data;
    if (!data.activities) {
      data.activities = [];
    }

    // Keep activities that do not belong to the current user
    data.activities = data.activities.filter(a => a.userId !== req.user._id);
    db.write(data);

    res.json({ message: 'Activity log cleared successfully.' });
  } catch (error) {
    next(error);
  }
};
