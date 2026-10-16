import { Request, Response } from 'express';
import { progressionService } from '../services/progressionService';
import { z } from 'zod';

const SubmitProgressSchema = z.object({
  userId: z.string().optional(),
  exerciseId: z.string().min(1),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1']),
  type: z.enum(['VISUAL_DUAL_CODING', 'SPACED_CLOZE', 'SYNTACTIC_CONSTRUCTOR']),
  isCorrect: z.boolean(),
  timeSpentMs: z.number().nonnegative(),
  userResponse: z.string(),
  difficultyRating: z.enum(['again', 'hard', 'good', 'easy']).optional(),
});

export class ProgressController {
  async submitProgress(req: Request, res: Response) {
    try {
      const parseResult = SubmitProgressSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          errors: parseResult.error.format(),
        });
      }

      const result = await progressionService.submitProgress(parseResult.data);

      return res.status(200).json({
        success: true,
        message: 'Progress recorded successfully',
        data: result,
      });
    } catch (error) {
      console.error('[ProgressController] Error processing submission:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while saving progress',
      });
    }
  }
}

export const progressController = new ProgressController();
