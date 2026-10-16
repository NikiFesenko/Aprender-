import { Request, Response } from 'express';
import { exerciseService } from '../services/exerciseService';
import { CefrLevel, ExerciseType } from '../types';

export class ExerciseController {
  async getExercises(req: Request, res: Response) {
    try {
      const { level, type } = req.query;

      const exercises = await exerciseService.getExercises({
        level: level ? (String(level).toUpperCase() as CefrLevel) : undefined,
        type: type ? (String(type).toUpperCase() as ExerciseType) : undefined,
      });

      return res.json({
        success: true,
        count: exercises.length,
        data: exercises,
      });
    } catch (error) {
      console.error('[ExerciseController] Error fetching exercises:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching exercises',
      });
    }
  }

  async getExerciseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const exercise = await exerciseService.getExerciseById(id);

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: `Exercise with id ${id} not found`,
        });
      }

      return res.json({
        success: true,
        data: exercise,
      });
    } catch (error) {
      console.error('[ExerciseController] Error fetching exercise by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while fetching exercise details',
      });
    }
  }
}

export const exerciseController = new ExerciseController();
