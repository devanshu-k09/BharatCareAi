import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const data = db.data;
      const user = data.users.find(u => u._id === decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      const { password, ...safeUser } = user;
      req.user = safeUser;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
