import { SubmitProgressPayload, UserStatsResponse } from '../types';
import { userRepository, IUserRepository } from '../repositories/userRepository';
import { cacheService, ICacheService } from '../cache/cacheService';

export class ProgressionService {
  constructor(
    private userRepo: IUserRepository = userRepository,
    private cache: ICacheService = cacheService
  ) {}

  async getUserStats(userId: string = 'usr_demo_aprende'): Promise<UserStatsResponse> {
    const cacheKey = `user:stats:${userId}`;
    const cached = await this.cache.get<UserStatsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const stats = await this.userRepo.getUserStats(userId);
    await this.cache.set(cacheKey, stats, 60); // 1 minute cache
    return stats;
  }

  async submitProgress(payload: SubmitProgressPayload) {
    const userId = payload.userId || 'usr_demo_aprende';
    const result = await this.userRepo.recordSubmission(payload);

    // Invalidate user stats cache
    await this.cache.del(`user:stats:${userId}`);

    // Compute Spaced Repetition Next Review Interval based on difficulty rating & speed
    let nextReviewHours = 24;
    if (payload.difficultyRating === 'again' || !payload.isCorrect) {
      nextReviewHours = 1; // 1 hour for recall errors
    } else if (payload.difficultyRating === 'hard') {
      nextReviewHours = 12;
    } else if (payload.difficultyRating === 'good') {
      nextReviewHours = 72; // 3 days
    } else if (payload.difficultyRating === 'easy') {
      nextReviewHours = 168; // 7 days
    }

    return {
      ...result,
      spacedRepetitionSchedule: {
        exerciseId: payload.exerciseId,
        nextReviewIntervalHours: nextReviewHours,
        recommendedReviewDate: new Date(Date.now() + nextReviewHours * 3600 * 1000).toISOString(),
      },
    };
  }
}

export const progressionService = new ProgressionService();
