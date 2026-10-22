import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppTab, CefrLevel, ExerciseType, LevelDiagnosticStats, UserStatsResponse } from '../types';
import { apiClient } from '../services/api';
import confetti from 'canvas-confetti';

interface AppState {
  currentLevel: CefrLevel;
  activeTab: AppTab;
  theme: 'dark' | 'light';
  totalXp: number;
  streakDays: number;
  completedExercises: Record<string, boolean>;
  levels: Record<CefrLevel, LevelDiagnosticStats>;
  levelUpNotification: { previous: CefrLevel; current: CefrLevel } | null;
  isDiagnosticOpen: boolean;
  isResearchModalOpen: boolean;
  isSettingsOpen: boolean;
  activeExerciseIndex: Record<string, number>; // key: `${level}_${tab}`
  currentStageNumber: number; // 1, 2, or 3 for active CEfr level

  // Actions
  setLevel: (level: CefrLevel) => void;
  setStageNumber: (stage: number) => void;
  setActiveTab: (tab: AppTab) => void;
  toggleTheme: () => void;
  recordExerciseResult: (params: {
    exerciseId: string;
    level: CefrLevel;
    type: ExerciseType;
    isCorrect: boolean;
    timeSpentMs: number;
    userResponse: string;
    difficultyRating?: 'again' | 'hard' | 'good' | 'easy';
  }) => Promise<{ earnedXp: number; isLevelUp: boolean }>;
  setExerciseIndex: (key: string, index: number) => void;
  nextExercise: (totalCount: number) => void;
  prevExercise: () => void;
  openDiagnosticModal: () => void;
  closeDiagnosticModal: () => void;
  openResearchModal: () => void;
  closeResearchModal: () => void;
  dismissLevelUp: () => void;
  resetProgress: () => void;
  syncWithBackend: () => Promise<void>;
}

const INITIAL_LEVELS: Record<CefrLevel, LevelDiagnosticStats> = {
  A1: {
    level: 'A1',
    levelName: 'Breakthrough (Beginner)',
    visualXp: 0,
    clozeXp: 0,
    syntaxXp: 0,
    totalLevelXp: 0,
    masteryPercentage: 0,
    exercisesCompleted: 0,
    accuracyRate: 100,
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
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentLevel: 'A1',
      activeTab: 'visual',
      theme: 'dark',
      totalXp: 0,
      streakDays: 1,
      completedExercises: {},
      levels: INITIAL_LEVELS,
      levelUpNotification: null,
      isDiagnosticOpen: false,
      isResearchModalOpen: false,
      isSettingsOpen: false,
      activeExerciseIndex: {},
      currentStageNumber: 1,

      setLevel: (level: CefrLevel) => set({ currentLevel: level, currentStageNumber: 1 }),

      setStageNumber: (stage: number) => set({ currentStageNumber: stage }),

      setActiveTab: (tab: AppTab) => set({ activeTab: tab }),

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme: nextTheme });
      },

      setExerciseIndex: (key: string, index: number) => {
        set((state) => ({
          activeExerciseIndex: {
            ...state.activeExerciseIndex,
            [key]: index,
          },
        }));
      },

      nextExercise: (totalCount: number) => {
        const { currentLevel, currentStageNumber, activeExerciseIndex } = get();
        const key = `${currentLevel}_visual_s${currentStageNumber}`;
        const currentIdx = activeExerciseIndex[key] || 0;

        if (currentIdx + 1 >= totalCount && currentStageNumber < 5) {
          // Progress to next stage within current level
          const nextStage = currentStageNumber + 1;
          const nextKey = `${currentLevel}_visual_s${nextStage}`;
          set((state) => ({
            currentStageNumber: nextStage,
            activeExerciseIndex: {
              ...state.activeExerciseIndex,
              [nextKey]: state.activeExerciseIndex[nextKey] || 0,
            },
          }));
        } else {
          const nextIdx = (currentIdx + 1) % Math.max(1, totalCount);
          set((state) => ({
            activeExerciseIndex: {
              ...state.activeExerciseIndex,
              [key]: nextIdx,
            },
          }));
        }
      },

      prevExercise: () => {
        const { currentLevel, currentStageNumber, activeExerciseIndex } = get();
        const key = `${currentLevel}_visual_s${currentStageNumber}`;
        const currentIdx = activeExerciseIndex[key] || 0;
        const prevIdx = Math.max(0, currentIdx - 1);
        set((state) => ({
          activeExerciseIndex: {
            ...state.activeExerciseIndex,
            [key]: prevIdx,
          },
        }));
      },

      recordExerciseResult: async ({
        exerciseId,
        level,
        type,
        isCorrect,
        timeSpentMs,
        userResponse,
        difficultyRating,
      }) => {
        const prevTotalXp = get().totalXp;
        const prevLevel = get().currentLevel;

        const baseEarned = 40;
        const earnedXp = isCorrect ? baseEarned : 10;
        const newTotalXp = prevTotalXp + earnedXp;

        const CEFR_ORDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

        // Send submission to backend asynchronously
        apiClient.submitProgress({
          exerciseId,
          level,
          type,
          isCorrect,
          timeSpentMs,
          userResponse,
          difficultyRating,
        }).catch((err) => console.warn('Background sync error', err));

        // Update local state and check level progression (50 questions per level)
        let promotedLevel = prevLevel;
        let isLevelUp = false;

        set((state) => {
          const currentLvlData = { ...state.levels[level] };
          if (type === 'VISUAL_DUAL_CODING') currentLvlData.visualXp += earnedXp;
          if (type === 'SPACED_CLOZE') currentLvlData.clozeXp += earnedXp;
          if (type === 'SYNTACTIC_CONSTRUCTOR') currentLvlData.syntaxXp += earnedXp;

          currentLvlData.totalLevelXp += earnedXp;
          if (isCorrect && !state.completedExercises[exerciseId]) {
            currentLvlData.exercisesCompleted += 1;
          }
          currentLvlData.masteryPercentage = Math.min(
            100,
            Math.round((currentLvlData.exercisesCompleted / 50) * 100)
          );

          // Check if 50 questions completed in this level -> Promote to next CEFR level!
          const currentLvlIdx = CEFR_ORDER.indexOf(level);
          if (currentLvlData.exercisesCompleted >= 50 && currentLvlIdx < CEFR_ORDER.length - 1) {
            promotedLevel = CEFR_ORDER[currentLvlIdx + 1];
            isLevelUp = true;
          }

          const updatedLevels = {
            ...state.levels,
            [level]: currentLvlData,
          };

          return {
            totalXp: newTotalXp,
            currentLevel: isLevelUp ? promotedLevel : state.currentLevel,
            currentStageNumber: isLevelUp ? 1 : state.currentStageNumber,
            levels: updatedLevels,
            completedExercises: {
              ...state.completedExercises,
              [exerciseId]: isCorrect,
            },
            levelUpNotification: isLevelUp
              ? { previous: prevLevel, current: promotedLevel }
              : state.levelUpNotification,
          };
        });

        // Trigger celebratory confetti if correct or level up
        if (typeof window !== 'undefined' && isCorrect) {
          try {
            confetti({
              particleCount: isLevelUp ? 120 : 45,
              spread: isLevelUp ? 80 : 55,
              origin: { y: 0.7 },
              colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399'],
            });
          } catch {
            // ignore if confetti in test/headless environment
          }
        }

        return { earnedXp, isLevelUp };
      },

      openDiagnosticModal: () => set({ isDiagnosticOpen: true }),
      closeDiagnosticModal: () => set({ isDiagnosticOpen: false }),

      openResearchModal: () => set({ isResearchModalOpen: true }),
      closeResearchModal: () => set({ isResearchModalOpen: false }),

      dismissLevelUp: () => set({ levelUpNotification: null }),

      resetProgress: () => {
        set({
          totalXp: 0,
          currentLevel: 'A1',
          completedExercises: {},
          levels: INITIAL_LEVELS,
          activeExerciseIndex: {},
        });
      },

      syncWithBackend: async () => {
        const stats: UserStatsResponse | null = await apiClient.getUserStats();
        if (stats) {
          set({
            totalXp: stats.totalXp,
            currentLevel: stats.currentLevel,
            streakDays: stats.streakDays,
            levels: stats.levels,
          });
        }
      },
    }),
    {
      name: 'aprende-learning-state',
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        activeTab: state.activeTab,
        theme: state.theme,
        totalXp: state.totalXp,
        streakDays: state.streakDays,
        completedExercises: state.completedExercises,
        levels: state.levels,
        activeExerciseIndex: state.activeExerciseIndex,
        currentStageNumber: state.currentStageNumber,
      }),
    }
  )
);
