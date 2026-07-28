import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import legalAssistantRoutes from './routes/legalAssistantRoutes.js';

dotenv.config();

// Initialise local JSON file database (no MongoDB required)
initDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // allow inline scripts for local dev
}));
app.use(morgan('dev'));

// Serve frontend static files without requiring .html extension
app.use(express.static(path.join(__dirname, '../frontend'), { extensions: ['html'] }));

// Serve uploaded user files from the volume-mounted persistent directory
app.use('/uploads', express.static(path.join(__dirname, '../data/uploads')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'BharatCare AI API is running' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/legal-assistant', legalAssistantRoutes);

// 404 Fallback
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({ message: 'API Route Not Found' });
  } else {
    res.status(404).sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
  res.status(err.status || 500).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ BharatCare AI server running on http://localhost:${PORT}`);
  console.log(`   Data stored at: backend/data/db.json`);
});
