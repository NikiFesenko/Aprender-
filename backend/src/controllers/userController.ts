import { Request, Response } from 'express';
import { progressionService } from '../services/progressionService';

export class UserController {
  async getUserStats(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || 'usr_demo_aprende';
      const stats = await progressionService.getUserStats(userId);

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('[UserController] Error fetching user stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching user statistics',
      });
    }
  }
}

export const userController = new UserController();
