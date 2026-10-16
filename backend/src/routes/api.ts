import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { progressController } from '../controllers/progressController';
import { userController } from '../controllers/userController';
import { cacheService } from '../cache/cacheService';

const router = Router();

// Health and Readiness Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    redisConnected: cacheService.isRedisConnected(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Exercises Routes
router.get('/exercises', (req, res) => exerciseController.getExercises(req, res));
router.get('/exercises/:id', (req, res) => exerciseController.getExerciseById(req, res));

// Progression & Submission Routes
router.post('/progress/submit', (req, res) => progressController.submitProgress(req, res));

// User Profile & Diagnostic Statistics Routes
router.get('/user/stats', (req, res) => userController.getUserStats(req, res));

export default router;
