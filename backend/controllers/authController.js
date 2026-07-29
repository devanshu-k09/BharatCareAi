import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper to remove sensitive fields
const getSafeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// POST /api/auth/register
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({ message: 'Full Name must be at least 3 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const data = db.data;
    const exists = data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const now = new Date().toISOString();

    const user = {
      _id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: null,
      avatar: null,
      password: hashed,
      role: 'user',
      language: 'English',
      settings: {
        emailNotifications: true,
        importantAlerts: true,
        saveSearchHistory: true
      },
      createdAt: now,
      updatedAt: now
    };

    data.users.push(user);
    db.write(data);

    console.log(`[AUTH] User inserted successfully. ID: ${user._id}, Email: ${user.email}`);

    res.status(201).json({
      ...getSafeUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(`[AUTH] Registration error:`, error);
    next(error);
  }
};

// POST /api/auth/login
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const data = db.data;
    const user = data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      console.warn(`[AUTH] Login failed: User not found for email ${email}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn(`[AUTH] Login failed: Password mismatch for user ID: ${user._id}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    console.log(`[AUTH] User logged in successfully. ID: ${user._id}`);

    res.json({
      ...getSafeUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(`[AUTH] Login error:`, error);
    next(error);
  }
};

// GET /api/auth/profile  (protected)
export const getUserProfile = async (req, res, next) => {
  try {
    const data = db.data;
    const user = data.users.find(u => u._id === req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(getSafeUser(user));
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile  (protected)
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: 'Full Name is required and must be at least 3 characters long.' });
    }

    let cleanPhone = null;
    if (phone && phone.trim() !== '') {
      const digitsOnly = phone.replace(/\D/g, '');
      const tenDigits = digitsOnly.length === 12 && digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;
      
      if (!/^[0-9]{10}$/.test(tenDigits)) {
        return res.status(400).json({ message: 'Please enter a valid 10-digit phone number.' });
      }
      cleanPhone = tenDigits;
    }

    const data = db.data;
    const userIndex = data.users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    data.users[userIndex].name = name.trim();
    data.users[userIndex].phone = cleanPhone;
    data.users[userIndex].updatedAt = new Date().toISOString();

    db.write(data);

    res.json(getSafeUser(data.users[userIndex]));
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/profile/avatar  (protected)
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file (JPG, PNG, WEBP).' });
    }

    const data = db.data;
    const userIndex = data.users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = data.users[userIndex];

    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(__dirname, '../data', user.avatar);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch(e) {}
      }
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    data.users[userIndex].avatar = avatarUrl;
    data.users[userIndex].updatedAt = new Date().toISOString();
    
    db.write(data);

    res.json(getSafeUser(data.users[userIndex]));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/auth/profile/avatar  (protected)
export const deleteAvatar = async (req, res, next) => {
  try {
    const data = db.data;
    const userIndex = data.users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = data.users[userIndex];

    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(__dirname, '../data', user.avatar);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch(e) {}
      }
    }

    data.users[userIndex].avatar = null;
    data.users[userIndex].updatedAt = new Date().toISOString();

    db.write(data);

    res.json(getSafeUser(data.users[userIndex]));
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/settings (protected)
export const getUserSettings = async (req, res, next) => {
  try {
    const data = db.data;
    const user = data.users.find(u => u._id === req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const defaultSettings = {
      emailNotifications: true,
      importantAlerts: true,
      saveSearchHistory: true
    };

    const settings = { ...defaultSettings, ...(user.settings || {}) };
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/settings (protected)
export const updateUserSettings = async (req, res, next) => {
  try {
    const { emailNotifications, importantAlerts, saveSearchHistory } = req.body;

    const data = db.data;
    const userIndex = data.users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const currentSettings = data.users[userIndex].settings || {
      emailNotifications: true,
      importantAlerts: true,
      saveSearchHistory: true
    };

    const newSettings = {
      emailNotifications: typeof emailNotifications === 'boolean' ? emailNotifications : currentSettings.emailNotifications,
      importantAlerts: typeof importantAlerts === 'boolean' ? importantAlerts : currentSettings.importantAlerts,
      saveSearchHistory: typeof saveSearchHistory === 'boolean' ? saveSearchHistory : currentSettings.saveSearchHistory
    };

    data.users[userIndex].settings = newSettings;
    data.users[userIndex].updatedAt = new Date().toISOString();

    db.write(data);

    res.json(newSettings);
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/change-password (protected)
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const data = db.data;
    const userIndex = data.users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = data.users[userIndex];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: 'New password cannot be the same as current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    data.users[userIndex].password = hashed;
    data.users[userIndex].updatedAt = new Date().toISOString();

    db.write(data);

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/auth/account (protected)
export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = db.data;

    const userIndex = data.users.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = data.users[userIndex];

    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const avatarPath = path.join(__dirname, '../data', user.avatar);
      if (fs.existsSync(avatarPath)) {
        try { fs.unlinkSync(avatarPath); } catch(e) {}
      }
    }

    data.users = data.users.filter(u => u._id !== userId);

    if (data.chats) {
      data.chats = data.chats.filter(c => c.user !== userId);
    }

    if (data.complaints) {
      data.complaints = data.complaints.filter(c => c.user !== userId);
    }

    db.write(data);

    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
