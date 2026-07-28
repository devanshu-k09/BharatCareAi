import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const protect = (req, res, next) => {
  let token;
  console.log(`[API LOG] --- NEW REQUEST ---`);
  console.log(`[API LOG] Request received: ${req.method} ${req.originalUrl}`);
  console.log(`[API LOG] Request Headers:`, JSON.stringify(req.headers));

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log(`[API LOG] JWT Token extracted: ${token.substring(0, 15)}...`);

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`[API LOG] JWT Decoded successfully:`, JSON.stringify(decoded));

      const data = db.data;
      console.log(`[API LOG] Executing LowDB Query: Finding user by ID "${decoded.id}"`);
      const user = data.users.find(u => u._id === decoded.id);

      if (!user) {
        console.warn(`[API LOG] Authentication failed: User ID "${decoded.id}" not found in db.json.`);
        return res.status(401).json({ 
          message: `Authentication failed: User with ID "${decoded.id}" not found. Your local session token might be stale or your account has been removed. Please log out and sign in again to generate a valid token.` 
        });
      }

      const { password, ...safeUser } = user;
      req.user = safeUser;
      console.log(`[API LOG] Authenticated user:`, JSON.stringify(req.user));
      next();
    } catch (error) {
      console.error(`[API LOG] Authentication failed: Token verification failed. Error:`, error.message);
      res.status(401).json({ message: 'Authentication failed: Not authorized, token invalid or expired. Error: ' + error.message });
    }
  } else {
    console.warn(`[API LOG] Authentication failed: Missing Authorization Bearer token header.`);
    res.status(401).json({ message: 'Authentication failed: Not authorized, no Bearer token provided in headers.' });
  }
};
