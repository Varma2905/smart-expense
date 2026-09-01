import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import recurringRoutes from './routes/recurringRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();

// Security & Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vercel Request URL Normalizer
app.use((req, res, next) => {
  if (req.query && req.query.url) {
    const rawUrl = req.query.url.startsWith('/') ? req.query.url : '/' + req.query.url;
    req.url = rawUrl;
  }
  next();
});

// Root welcome endpoint
const welcomeHandler = (req, res) => {
  res.json({
    success: true,
    message: 'SmartExpense Backend API Server is running smoothly',
    health: '/api/health',
    timestamp: new Date().toISOString(),
  });
};
app.get('/', welcomeHandler);
app.get('/api', welcomeHandler);

// Apply rate limiting to all API requests
app.use('/api', apiLimiter);

// Health Check
const healthHandler = (req, res) => {
  res.json({
    success: true,
    message: 'SmartExpense API Server is running smoothly',
    timestamp: new Date().toISOString(),
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount API Routes under both /api and root paths
const routes = [
  ['/auth', authRoutes],
  ['/transactions', transactionRoutes],
  ['/dashboard', dashboardRoutes],
  ['/budgets', budgetRoutes],
  ['/analytics', analyticsRoutes],
  ['/recurring', recurringRoutes],
  ['/reports', reportRoutes],
  ['/ai', aiRoutes],
  ['/settings', settingsRoutes],
];

routes.forEach(([path, router]) => {
  app.use(`/api${path}`, router);
  app.use(path, router);
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
