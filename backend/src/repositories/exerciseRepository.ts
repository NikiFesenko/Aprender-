import { CefrLevel, Exercise, ExerciseType } from '../types';
import { INITIAL_EXERCISES } from '../data/exercisesData';

export interface IExerciseRepository {
  findAll(filters?: { level?: CefrLevel; type?: ExerciseType; stageNumber?: number }): Promise<Exercise[]>;
  findById(id: string): Promise<Exercise | null>;
}

export class InMemoryExerciseRepository implements IExerciseRepository {
  private exercises: Exercise[] = [...INITIAL_EXERCISES];

  async findAll(filters?: { level?: CefrLevel; type?: ExerciseType; stageNumber?: number }): Promise<Exercise[]> {
    let result = this.exercises;
    if (filters?.level) {
      result = result.filter((e) => e.level.toUpperCase() === filters.level?.toUpperCase());
    }
    if (filters?.type) {
      result = result.filter((e) => e.type.toUpperCase() === filters.type?.toUpperCase());
    }
    if (filters?.stageNumber) {
      const stageMatches = result.filter((e) => e.stageNumber === filters.stageNumber);
      if (stageMatches.length > 0) {
        result = stageMatches;
      }
    }
    return result;
  }

  async findById(id: string): Promise<Exercise | null> {
    const item = this.exercises.find((e) => e.id === id);
    return item || null;
  }
}

export const exerciseRepository = new InMemoryExerciseRepository();
