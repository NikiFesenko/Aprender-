import { CefrLevel, Exercise, ExerciseType, UserStatsResponse } from '../types';
import { LOCAL_EXERCISES } from '../data/localExercises';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = {
  async getExercises(level?: CefrLevel, type?: ExerciseType, stageNumber?: number): Promise<Exercise[]> {
    try {
      const params = new URLSearchParams();
      if (level) params.append('level', level);
      if (type) params.append('type', type);
      if (stageNumber) params.append('stage', String(stageNumber));

      const res = await fetch(`${API_BASE}/exercises?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        return json.data;
      }
    } catch {
      console.warn('[ApiClient] Using local exercise fallback');
    }

    let filtered = LOCAL_EXERCISES;
    if (level) {
      filtered = filtered.filter((e) => e.level.toUpperCase() === level.toUpperCase());
    }
    if (type) {
      filtered = filtered.filter((e) => e.type.toUpperCase() === type.toUpperCase());
    }
    if (stageNumber) {
      const stageFiltered = filtered.filter((e) => e.stageNumber === stageNumber);
      if (stageFiltered.length > 0) {
        filtered = stageFiltered;
      }
    }
    return filtered;
  },

  async submitProgress(payload: {
    exerciseId: string;
    level: CefrLevel;
    type: ExerciseType;
    isCorrect: boolean;
    timeSpentMs: number;
    userResponse: string;
    difficultyRating?: 'again' | 'hard' | 'good' | 'easy';
  }) {
    try {
      const res = await fetch(`${API_BASE}/progress/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      console.warn('[ApiClient] Backend submission failed, proceeding with local store computation');
    }
    return null;
  },

  async getUserStats(): Promise<UserStatsResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/user/stats`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      console.warn('[ApiClient] Backend stats unavailable, utilizing local store progress');
    }
    return null;
  },
};
