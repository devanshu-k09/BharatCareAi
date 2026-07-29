import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { createServerActivity } from '../utils/activityHelper.js';

// GET /api/topics
// Search, filter by tag, category, status
export const getTopics = async (req, res, next) => {
  try {
    const { q, tag, cat, status } = req.query;
    const data = db.data;
    if (!data.topics) data.topics = [];
    if (!data.bookmarks) data.bookmarks = [];

    const userId = req.user ? req.user._id : null;
    const userBookmarks = userId ? data.bookmarks.filter(b => b.userId === userId).map(b => b.topicId) : [];

    let result = data.topics.filter(t => (status ? t.status === status : t.status === 'published'));

    // Tag filter
    if (tag && tag.trim() !== '') {
      const cleanTag = tag.trim().replace(/^#/, '').toLowerCase();
      result = result.filter(t => t.tags && t.tags.some(tg => tg.toLowerCase() === cleanTag));
    }

    // Category filter
    if (cat && cat.trim() !== '') {
      const cleanCat = cat.trim().toLowerCase();
      result = result.filter(t => t.category && t.category.toLowerCase().includes(cleanCat));
    }

    // Search query
    if (q && q.trim() !== '') {
      const term = q.trim().toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        (t.category && t.category.toLowerCase().includes(term)) ||
        (t.tags && t.tags.some(tg => tg.toLowerCase().includes(term))) ||
        (t.content && t.content.laws && t.content.laws.some(l => l.toLowerCase().includes(term)))
      );
    }

    // Sort by views desc
    result.sort((a, b) => (b.views || 0) - (a.views || 0));

    // Map bookmark status
    const formatted = result.map(t => ({
      ...t,
      isBookmarked: userBookmarks.includes(t._id)
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// GET /api/topics/trending
export const getTrendingTopics = async (req, res, next) => {
  try {
    const data = db.data;
    if (!data.topics) data.topics = [];
    if (!data.bookmarks) data.bookmarks = [];

    const userId = req.user ? req.user._id : null;
    const userBookmarks = userId ? data.bookmarks.filter(b => b.userId === userId).map(b => b.topicId) : [];

    const trending = data.topics
      .filter(t => t.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6)
      .map(t => ({
        ...t,
        isBookmarked: userBookmarks.includes(t._id)
      }));

    res.json(trending);
  } catch (error) {
    next(error);
  }
};

// GET /api/topics/bookmarks
export const getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = db.data;
    if (!data.topics) data.topics = [];
    if (!data.bookmarks) data.bookmarks = [];

    const bookmarkedIds = data.bookmarks.filter(b => b.userId === userId).map(b => b.topicId);
    const bookmarkedTopics = data.topics
      .filter(t => bookmarkedIds.includes(t._id))
      .map(t => ({ ...t, isBookmarked: true }));

    res.json(bookmarkedTopics);
  } catch (error) {
    next(error);
  }
};

// GET /api/topics/:id
export const getTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = db.data;
    if (!data.topics) data.topics = [];
    if (!data.bookmarks) data.bookmarks = [];

    const topicIndex = data.topics.findIndex(t => t._id === id);
    if (topicIndex === -1) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Increment view count
    data.topics[topicIndex].views = (data.topics[topicIndex].views || 0) + 1;
    db.write(data);

    const topic = data.topics[topicIndex];
    const userId = req.user ? req.user._id : null;
    const isBookmarked = userId ? data.bookmarks.some(b => b.userId === userId && b.topicId === topic._id) : false;

    // Log activity if logged in
    if (userId) {
      createServerActivity(userId, 'Topic Opened', `Read legal details for '${topic.title}'.`, 'menu_book', 'navigation');
    }

    res.json({
      ...topic,
      isBookmarked
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/topics/:id/view
export const incrementViewCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = db.data;
    const topic = data.topics.find(t => t._id === id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    topic.views = (topic.views || 0) + 1;
    db.write(data);

    res.json({ views: topic.views });
  } catch (error) {
    next(error);
  }
};

// POST /api/topics/:id/bookmark
export const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const data = db.data;

    if (!data.bookmarks) data.bookmarks = [];

    const topic = data.topics.find(t => t._id === id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const existingIndex = data.bookmarks.findIndex(b => b.userId === userId && b.topicId === id);

    let isBookmarked = false;
    if (existingIndex > -1) {
      data.bookmarks.splice(existingIndex, 1);
      isBookmarked = false;
      createServerActivity(userId, 'Bookmark Removed', `Removed '${topic.title}' from saved topics.`, 'bookmark_border', 'settings');
    } else {
      data.bookmarks.push({
        _id: uuidv4(),
        userId,
        topicId: id,
        createdAt: new Date().toISOString()
      });
      isBookmarked = true;
      createServerActivity(userId, 'Topic Bookmarked', `Saved '${topic.title}' for quick reference.`, 'bookmark', 'settings');
    }

    db.write(data);

    res.json({ isBookmarked, message: isBookmarked ? 'Bookmarked successfully' : 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
};

// POST /api/topics (Admin)
export const createTopic = async (req, res, next) => {
  try {
    const { title, description, category, tags, icon, content } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const data = db.data;
    if (!data.topics) data.topics = [];

    const newTopic = {
      _id: uuidv4(),
      title,
      description,
      category: category || 'General',
      tags: tags || [],
      icon: icon || 'article',
      views: 0,
      status: 'published',
      updatedAt: new Date().toISOString(),
      content: content || {}
    };

    data.topics.push(newTopic);
    db.write(data);

    res.status(201).json(newTopic);
  } catch (error) {
    next(error);
  }
};

// PUT /api/topics/:id (Admin)
export const updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = db.data;
    const topicIndex = data.topics.findIndex(t => t._id === id);
    if (topicIndex === -1) return res.status(404).json({ message: 'Topic not found' });

    data.topics[topicIndex] = {
      ...data.topics[topicIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    db.write(data);
    res.json(data.topics[topicIndex]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/topics/:id (Admin)
export const deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = db.data;
    data.topics = data.topics.filter(t => t._id !== id);
    data.bookmarks = data.bookmarks.filter(b => b.topicId !== id);

    db.write(data);
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    next(error);
  }
};
