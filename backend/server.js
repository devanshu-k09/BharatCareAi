import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initDB } from './config/db.js';
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
app.use(helmet());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'BharatCare AI API is running' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/legal-assistant', legalAssistantRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ BharatCare AI server running on http://localhost:${PORT}`);
  console.log(`   Data stored at: backend/data/db.json`);
});
