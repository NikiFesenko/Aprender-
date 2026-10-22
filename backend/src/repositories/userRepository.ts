import { CefrLevel, SubmitProgressPayload, UserStatsResponse, LevelDiagnosticStats } from '../types';

export interface IUserRepository {
  getUserStats(userId: string): Promise<UserStatsResponse>;
  recordSubmission(payload: SubmitProgressPayload): Promise<{
    earnedXp: number;
    newTotalXp: number;
    levelUp: boolean;
    previousLevel: CefrLevel;
    newLevel: CefrLevel;
    stats: UserStatsResponse;
  }>;
}

const LEVEL_THRESHOLDS: { level: CefrLevel; xpReq: number }[] = [
  { level: 'A1', xpReq: 0 },
  { level: 'A2', xpReq: 250 },
  { level: 'B1', xpReq: 650 },
  { level: 'B2', xpReq: 1300 },
  { level: 'C1', xpReq: 2200 },
];

export class InMemoryUserRepository implements IUserRepository {
  private userStats: UserStatsResponse = {
    userId: 'usr_demo_aprende',
    name: 'Estudiante',
    currentLevel: 'A1',
    currentStageNumber: 1,
    totalXp: 180,
    streakDays: 4,
    nextLevelXpTarget: 250,
    progressToNextLevel: 72,
    levels: {
      A1: {
        level: 'A1',
        levelName: 'Breakthrough (Beginner)',
        visualXp: 80,
        clozeXp: 50,
        syntaxXp: 50,
        totalLevelXp: 180,
        masteryPercentage: 72,
        exercisesCompleted: 4,
        accuracyRate: 95,
        completedStages: [1],
      },
      A2: {
        level: 'A2',
        levelName: 'Waystage (Elementary)',
        visualXp: 0,
        clozeXp: 0,
        syntaxXp: 0,
        totalLevelXp: 0,
        masteryPercentage: 0,
        exercisesCompleted: 0,
        accuracyRate: 100,
        completedStages: [],
      },
      B1: {
        level: 'B1',
        levelName: 'Threshold (Intermediate)',
        visualXp: 0,
        clozeXp: 0,
        syntaxXp: 0,
        totalLevelXp: 0,
        masteryPercentage: 0,
        exercisesCompleted: 0,
        accuracyRate: 100,
        completedStages: [],
      },
      B2: {
        level: 'B2',
        levelName: 'Vantage (Upper-Intermediate)',
        visualXp: 0,
        clozeXp: 0,
        syntaxXp: 0,
        totalLevelXp: 0,
        masteryPercentage: 0,
        exercisesCompleted: 0,
        accuracyRate: 100,
        completedStages: [],
      },
      C1: {
        level: 'C1',
        levelName: 'Effective Operational Proficiency',
        visualXp: 0,
        clozeXp: 0,
        syntaxXp: 0,
        totalLevelXp: 0,
        masteryPercentage: 0,
        exercisesCompleted: 0,
        accuracyRate: 100,
        completedStages: [],
      },
    },
  };

  async getUserStats(_userId: string): Promise<UserStatsResponse> {
    return { ...this.userStats };
  }

  async recordSubmission(payload: SubmitProgressPayload) {
    const prevLevel = this.userStats.currentLevel;

    // XP calculation:
    let baseMultiplier = 35;
    if (payload.type === 'VISUAL_DUAL_CODING') baseMultiplier = 40;
    if (payload.type === 'SPACED_CLOZE') baseMultiplier = 50;
    if (payload.type === 'SYNTACTIC_CONSTRUCTOR') baseMultiplier = 60;

    // Accuracy factor
    const earnedXp = payload.isCorrect ? baseMultiplier : 5;

    this.userStats.totalXp += earnedXp;

    // Update level specific metrics
    const currentLvlData = this.userStats.levels[payload.level];
    if (currentLvlData) {
      if (payload.type === 'VISUAL_DUAL_CODING') currentLvlData.visualXp += earnedXp;
      if (payload.type === 'SPACED_CLOZE') currentLvlData.clozeXp += earnedXp;
      if (payload.type === 'SYNTACTIC_CONSTRUCTOR') currentLvlData.syntaxXp += earnedXp;

      currentLvlData.totalLevelXp += earnedXp;
      currentLvlData.exercisesCompleted += 1;
      currentLvlData.masteryPercentage = Math.min(100, Math.round((currentLvlData.totalLevelXp / 300) * 100));
    }

    // Determine current CEFR Level based on total XP
    let calculatedLevel: CefrLevel = 'A1';
    let nextTarget = 250;
    let prevThreshold = 0;

    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (this.userStats.totalXp >= LEVEL_THRESHOLDS[i].xpReq) {
        calculatedLevel = LEVEL_THRESHOLDS[i].level;
        prevThreshold = LEVEL_THRESHOLDS[i].xpReq;
        nextTarget = LEVEL_THRESHOLDS[i + 1] ? LEVEL_THRESHOLDS[i + 1].xpReq : LEVEL_THRESHOLDS[i].xpReq + 1000;
        break;
      }
    }

    const levelUp = calculatedLevel !== prevLevel;
    this.userStats.currentLevel = calculatedLevel;
    this.userStats.nextLevelXpTarget = nextTarget;

    const span = nextTarget - prevThreshold;
    const progressInLevel = this.userStats.totalXp - prevThreshold;
    this.userStats.progressToNextLevel = Math.min(100, Math.max(0, Math.round((progressInLevel / span) * 100)));

    return {
      earnedXp,
      newTotalXp: this.userStats.totalXp,
      levelUp,
      previousLevel: prevLevel,
      newLevel: calculatedLevel,
      stats: { ...this.userStats },
    };
  }
}

export const userRepository = new InMemoryUserRepository();
