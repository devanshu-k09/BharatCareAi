import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const createServerActivity = (userId, title, description, icon = 'info', type = 'general', metadata = {}) => {
  try {
    const data = db.data;
    if (!data.activities) {
      data.activities = [];
    }

    const newActivity = {
      _id: uuidv4(),
      userId,
      title,
      description,
      icon,
      type,
      metadata,
      timestamp: new Date().toISOString()
    };

    data.activities.push(newActivity);
    db.write(data);
  } catch (err) {
    console.error('Failed to create server activity log:', err);
  }
};
