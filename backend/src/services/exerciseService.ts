import { CefrLevel, Exercise, ExerciseType } from '../types';
import { exerciseRepository, IExerciseRepository } from '../repositories/exerciseRepository';
import { cacheService, ICacheService } from '../cache/cacheService';

export class ExerciseService {
  constructor(
    private repo: IExerciseRepository = exerciseRepository,
    private cache: ICacheService = cacheService
  ) {}

  async getExercises(filters?: { level?: CefrLevel; type?: ExerciseType; stageNumber?: number }): Promise<Exercise[]> {
    const cacheKey = `exercises:${filters?.level || 'ALL'}:${filters?.type || 'ALL'}:${filters?.stageNumber || 'ALL'}`;
    const cached = await this.cache.get<Exercise[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const exercises = await this.repo.findAll(filters);
    await this.cache.set(cacheKey, exercises, 600); // 10 minutes cache
    return exercises;
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const cacheKey = `exercise:${id}`;
    const cached = await this.cache.get<Exercise>(cacheKey);
    if (cached) {
      return cached;
    }

    const exercise = await this.repo.findById(id);
    if (exercise) {
      await this.cache.set(cacheKey, exercise, 600);
    }
    return exercise;
  }
}

export const exerciseService = new ExerciseService();
