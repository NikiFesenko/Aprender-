import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${duration}ms`);
  }
});

// Mount API routes
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Aprende Backend REST API Server is active!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
  console.log(`❤️  Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

export default app;
